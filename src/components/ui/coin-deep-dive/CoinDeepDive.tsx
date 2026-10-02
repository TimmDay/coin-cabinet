"use client"

import dynamic from "next/dynamic"
import { useArtifacts } from "~/api/artifacts"
import { useDeities } from "~/api/deities"
import { useDevices } from "~/api/devices"
import { useMints } from "~/api/mints"
import { usePlaces } from "~/api/places"
import { useTimelines } from "~/api/timelines"
import type { CustomMapMarker } from "~/components/map/Map"
import { MAP_BOUNDS } from "~/components/map/mapConfig"
import { useFoldFill } from "~/hooks/useFoldFill"
import { getArtifactLocationData } from "~/lib/utils/artifact-helpers"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import { addFoundEventToTimeline } from "~/lib/utils/provenance-helpers"
import type { CoinEnhanced } from "~/types/api"
import { clockNoteRoom } from "./CoinClockTips"
import { CoinRow } from "./CoinRow"
import { DeepDiveCardsSection } from "./DeepDiveCardsSection"

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("../../map/Map").then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200" />
    ),
  },
)

// Dynamically import TimelineWithMap component to prevent SSR issues with Leaflet
const TimelineWithMap = dynamic(
  () =>
    import("../../map/TimelineWithMap").then((mod) => ({
      default: mod.TimelineWithMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200" />
    ),
  },
)

type CoinDeepDiveProps = {
  coin: CoinEnhanced
}

function isWithinMapBounds(lat: number, lng: number) {
  const [[maxLat, minLng], [minLat, maxLng]] = MAP_BOUNDS.maxBounds

  return lat <= maxLat && lat >= minLat && lng >= minLng && lng <= maxLng
}

function getRelatedArtifactIds(coin: CoinEnhanced) {
  const artifactIds = new Set<string>()

  for (const deity of coin.deities ?? []) {
    for (const artifactId of deity.artifact_ids ?? []) {
      artifactIds.add(artifactId)
    }
  }

  for (const figure of coin.historical_figures ?? []) {
    for (const artifactId of figure.artifact_ids ?? []) {
      artifactIds.add(artifactId)
    }
  }

  return [...artifactIds]
}

function buildDeityPlaceMarkers(
  coin: CoinEnhanced,
  places: ReturnType<typeof usePlaces>["data"],
  allDeities: ReturnType<typeof useDeities>["data"],
): CustomMapMarker[] {
  if (!places) {
    return []
  }

  const deityNamesByPlaceId = new globalThis.Map<number, Set<string>>()

  const deityIdsFromCoin = (coin.deity_id ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id))

  const resolvedDeities =
    allDeities?.filter((deity) => deityIdsFromCoin.includes(deity.id)) ??
    coin.deities ??
    []

  for (const deity of resolvedDeities) {
    for (const rawPlaceId of deity.place_ids ?? []) {
      const placeId =
        typeof rawPlaceId === "number"
          ? rawPlaceId
          : Number.parseInt(String(rawPlaceId), 10)

      if (!Number.isFinite(placeId)) {
        continue
      }

      const names = deityNamesByPlaceId.get(placeId) ?? new Set<string>()
      names.add(deity.name)
      deityNamesByPlaceId.set(placeId, names)
    }
  }

  return [...deityNamesByPlaceId.entries()].flatMap(([placeId, deityNames]) => {
    const place = places.find(
      (candidate) => Number(candidate.id) === Number(placeId),
    )

    const lat = Number(place?.lat)
    const lng = Number(place?.lng)

    if (!place || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return []
    }

    if (!isWithinMapBounds(lat, lng)) {
      return []
    }

    const relatedDeities = [...deityNames]
    const deityLabel =
      relatedDeities.length === 1
        ? `Associated with ${relatedDeities[0]}`
        : `Associated with ${relatedDeities.join(", ")}`

    return [
      {
        id: `deity-place-${place.id}`,
        lat,
        lng,
        title: place.name,
        subtitle: deityLabel,
        description:
          place.flavour_text ?? place.location_description ?? undefined,
        className: "text-amber-900",
        fillColor: "#0f172a",
        borderColor: "#92400e",
        sizeScale: 0.67,
        centerDotScale: 0.7,
        showPopup: true,
        zIndexOffset: 200,
      },
    ]
  })
}

// Data transformation helpers
function buildTimelineForCoin(
  coin: CoinEnhanced,
  dbTimelines: ReturnType<typeof useTimelines>["data"],
  mints: ReturnType<typeof useMints>["data"],
) {
  // Get timeline from database based on coin's timeline IDs
  if (coin.timelines_id && coin.timelines_id.length > 0 && dbTimelines) {
    const coinTimeline = dbTimelines.find((timeline) =>
      coin.timelines_id!.includes(timeline.id),
    )
    if (coinTimeline) {
      const withMintEvent = addCoinMintingEventToTimeline(
        coinTimeline.timeline,
        {
          denomination: coin.denomination,
          mint_id: coin.mint_id,
          mint_year_earliest: coin.mint_year_earliest,
          mint_year_latest: coin.mint_year_latest,
        },
        mints, // Pass mints data for timeline event creation
      )
      return addFoundEventToTimeline(withMintEvent, coin.found_event)
    }
  }

  // No timeline found
  return null
}

function getFoundMarker(coin: CoinEnhanced): CustomMapMarker | null {
  const found = coin.found_event
  if (!found) return null

  return {
    id: `coin-found-${coin.id}`,
    lat: found.lat,
    lng: found.lng,
    title: "Coin Found",
    subtitle: "This coin was found here",
    description: found.notes ?? undefined,
    className: "text-emerald-900",
    fillColor: "#059669",
    borderColor: "#059669",
    showPopup: true,
    zIndexOffset: 900,
  }
}

function getMintCoordinates(
  coin: CoinEnhanced,
  mints: ReturnType<typeof useMints>["data"],
): [number, number] | null {
  if (!coin.mint_id || !mints) return null

  const mint = mints.find((m) => m.id === coin.mint_id)
  if (!mint?.lat || !mint?.lng) return null

  return [mint.lat, mint.lng]
}

/** How much of the next section shows above the fold on desktop. */
const FOLD_PEEK_PX = 32

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const { data: dbTimelines } = useTimelines()
  const { data: allDeities } = useDeities()
  const { data: allDevices = [] } = useDevices()
  const { data: mints } = useMints()
  const { data: artifacts } = useArtifacts()
  const { data: places } = usePlaces()

  const obvDevices = allDevices.filter((d) =>
    coin.obv_device_ids?.includes(d.id),
  )
  const revDevices = allDevices.filter((d) =>
    coin.rev_device_ids?.includes(d.id),
  )

  // Process data using helper functions
  const matchingTimeline = buildTimelineForCoin(coin, dbTimelines, mints)
  const mintCoords = getMintCoordinates(coin, mints)
  const foundMarker = getFoundMarker(coin)

  // Get mint name for map highlighting
  const mint =
    coin.mint_id && mints ? mints.find((m) => m.id === coin.mint_id) : null
  const mintName = mint?.name

  const relatedArtifactIds = getRelatedArtifactIds(coin)
  const artifactMarkers: CustomMapMarker[] = relatedArtifactIds.flatMap(
    (artifactId) => {
      const artifact = artifacts?.find(
        (candidate) => candidate.id === artifactId,
      )
      if (!artifact) {
        return []
      }

      const location = getArtifactLocationData(artifact, places)
      if (location.lat === null || location.lng === null) {
        return []
      }

      if (!isWithinMapBounds(location.lat, location.lng)) {
        return []
      }

      return [
        {
          id: `artifact-${artifact.id}`,
          lat: location.lat,
          lng: location.lng,
          title: artifact.name,
          subtitle:
            location.institutionName ?? artifact.location_name ?? undefined,
          description:
            artifact.flavour_text ?? artifact.historical_notes ?? undefined,
          className: "text-slate-700",
          fillColor: "#475569",
          borderColor: "#94a3b8",
          showPopup: true,
          zIndexOffset: 50,
        },
      ]
    },
  )

  const deityPlaceMarkers = buildDeityPlaceMarkers(coin, places, allDeities)

  const standaloneMarkers: CustomMapMarker[] = [
    ...(mintCoords && mintName
      ? [
          {
            id: `coin-mint-${coin.id}`,
            lat: mintCoords[0],
            lng: mintCoords[1],
            title: mintName,
            subtitle: "This coin was minted here",
            description:
              coin.mint_year_earliest !== null &&
              coin.mint_year_earliest !== undefined
                ? `Minted around ${coin.mint_year_earliest}`
                : undefined,
            className: "text-amber-900",
            fillColor: "#f59e0b",
            borderColor: "#f59e0b",
            showPopup: true,
            zIndexOffset: 1000,
          },
        ]
      : []),
    ...deityPlaceMarkers,
    ...artifactMarkers,
    ...(foundMarker ? [foundMarker] : []),
  ]

  // Determine map display logic - show timeline map if available, otherwise mint map
  const shouldShowMap = Boolean(
    matchingTimeline ||
    mintCoords ||
    deityPlaceMarkers.length ||
    artifactMarkers.length ||
    foundMarker,
  )
  const mapCenter =
    mintCoords ??
    (deityPlaceMarkers.length > 0
      ? ([deityPlaceMarkers[0]!.lat, deityPlaceMarkers[0]!.lng] as [
          number,
          number,
        ])
      : artifactMarkers.length > 0
        ? ([artifactMarkers[0]!.lat, artifactMarkers[0]!.lng] as [
            number,
            number,
          ])
        : foundMarker
          ? ([foundMarker.lat, foundMarker.lng] as [number, number])
          : undefined)

  const clockNotes = coin.clock_notes ?? []
  const clockNotesFor = (side: "obverse" | "reverse") =>
    clockNotes.filter((note) => note.side === side)
  // On desktop the coins fill the first screen, centred, with the start of the
  // map just showing at the bottom
  const foldRef = useFoldFill<HTMLDivElement>(FOLD_PEEK_PX)

  // Both faces share the same room, so the coins and legends stay level
  const clockRoom = clockNoteRoom(clockNotes)

  return (
    <section className="w-full space-y-8 md:space-y-12 md:overflow-x-hidden">
      {/* Obverse and reverse: stacked on small screens, side by side on desktop */}
      <div
        ref={foldRef}
        className={`flex flex-col gap-8 md:gap-12 lg:grid lg:content-center lg:justify-center lg:gap-x-2 lg:gap-y-6 xl:gap-x-8 ${
          coin.image_link_o && coin.image_link_r
            ? "lg:grid-cols-[auto_auto]"
            : "lg:grid-cols-[auto]"
        }`}
      >
        {coin.image_link_o && (
          <CoinRow
            side="obverse"
            imageLink={coin.image_link_o}
            imageLinkAltlight={coin.image_link_altlight_o}
            imageLinkSketch={coin.image_link_sketch_o}
            legendExpanded={coin.legend_o_expanded || coin.legend_o}
            legendTranslation={coin.legend_o_translation}
            description={coin.desc_o}
            flavourText={coin.flavour_obv}
            devices={obvDevices}
            clockNotes={clockNotesFor("obverse")}
            reserveTop={clockRoom.top}
            reserveBottom={clockRoom.bottom}
            priority={true}
          />
        )}

        {coin.image_link_r && (
          <CoinRow
            side="reverse"
            imageLink={coin.image_link_r}
            imageLinkAltlight={coin.image_link_altlight_r}
            imageLinkSketch={coin.image_link_sketch_r}
            legendExpanded={coin.legend_r_expanded || coin.legend_r}
            legendTranslation={coin.legend_r_translation}
            mintMark={coin.mint_mark}
            description={coin.desc_r}
            flavourText={coin.flavour_rev}
            devices={revDevices}
            clockNotes={clockNotesFor("reverse")}
            reserveTop={clockRoom.top}
            reserveBottom={clockRoom.bottom}
          />
        )}
      </div>

      {/* Map Section */}
      {shouldShowMap && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="w-full">
            {matchingTimeline ? (
              <TimelineWithMap
                timeline={matchingTimeline}
                showHeaders={false}
                initialCenter={mapCenter}
                previewCenter={mintCoords ?? undefined}
                eventZoomLevel={6}
                additionalMarkers={deityPlaceMarkers.concat(artifactMarkers)}
                showDefaultMintMarkers={false}
                mapProps={{
                  height: "400px",
                }}
              />
            ) : mintCoords ? (
              <div className="space-y-4">
                <Map
                  center={mapCenter}
                  hideControls
                  showMintMarkers={false}
                  customMarkers={standaloneMarkers}
                  showTimelineEventMarker={false}
                  height="400px"
                />
              </div>
            ) : deityPlaceMarkers.length > 0 ||
              artifactMarkers.length > 0 ||
              foundMarker ? (
              <div className="space-y-4">
                <Map
                  center={mapCenter}
                  hideControls
                  showMintMarkers={false}
                  customMarkers={deityPlaceMarkers.concat(
                    artifactMarkers,
                    foundMarker ? [foundMarker] : [],
                  )}
                  showTimelineEventMarker={false}
                  height="400px"
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* DeepDive Cards Section */}
      <DeepDiveCardsSection
        coinData={coin}
        deities={coin.deities}
        historicalFigures={coin.historical_figures}
      />

      {/* Coin Details */}
      {(coin.flavour_tag || coin.flavour_obv || coin.flavour_rev) && (
        <FlavourFooter
          flavourGen={coin.flavour_tag ?? undefined}
          flavourObv={coin.flavour_obv ?? undefined}
          flavourRev={coin.flavour_rev ?? undefined}
        />
      )}
    </section>
  )
}

function FlavourFooter({
  flavourGen,
  flavourObv,
  flavourRev,
}: {
  flavourGen?: string
  flavourObv?: string
  flavourRev?: string
}) {
  return (
    <footer className="mt-4 space-y-2 border-t border-slate-600 pt-4">
      {flavourObv && (
        <p className="text-center text-base leading-relaxed break-words text-slate-400 italic">
          <span className="text-slate-400 not-italic">Obverse — </span>
          {flavourObv}
        </p>
      )}
      {flavourRev && (
        <p className="text-center text-base leading-relaxed break-words text-slate-400 italic">
          <span className="text-slate-400 not-italic">Reverse — </span>
          {flavourRev}
        </p>
      )}
      {flavourGen && (
        <p className="text-center text-base leading-relaxed break-words text-slate-400 italic">
          {flavourGen}
        </p>
      )}
    </footer>
  )
}
