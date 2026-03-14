"use client"

import dynamic from "next/dynamic"
import { useArtifacts } from "~/api/artifacts"
import { useMints } from "~/api/mints"
import { usePlaces } from "~/api/places"
import { useTimelines } from "~/api/timelines"
import type { CustomMapMarker } from "~/components/map/Map"
import { MAP_BOUNDS } from "~/components/map/mapConfig"
import { getArtifactLocationData } from "~/lib/utils/artifact-helpers"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import type { CoinEnhanced } from "~/types/api"
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
      return addCoinMintingEventToTimeline(
        coinTimeline.timeline,
        {
          denomination: coin.denomination,
          mint_id: coin.mint_id,
          mint_year_earliest: coin.mint_year_earliest,
          mint_year_latest: coin.mint_year_latest,
        },
        mints, // Pass mints data for timeline event creation
      )
    }
  }

  // No timeline found
  return null
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

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const { data: dbTimelines } = useTimelines()
  const { data: mints } = useMints()
  const { data: artifacts } = useArtifacts()
  const { data: places } = usePlaces()

  // Process data using helper functions
  const matchingTimeline = buildTimelineForCoin(coin, dbTimelines, mints)
  const mintCoords = getMintCoordinates(coin, mints)

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
    ...artifactMarkers,
  ]

  // Determine map display logic - show timeline map if available, otherwise mint map
  const shouldShowMap = Boolean(
    matchingTimeline || mintCoords || artifactMarkers.length,
  )
  const mapCenter =
    mintCoords ??
    (artifactMarkers.length > 0
      ? ([artifactMarkers[0]!.lat, artifactMarkers[0]!.lng] as [number, number])
      : undefined)

  return (
    <section className="w-full space-y-8 md:space-y-12 md:overflow-x-hidden">
      {/* Coin Row Components */}
      {coin.image_link_o && (
        <CoinRow
          side="obverse"
          imageLink={coin.image_link_o}
          imageLinkAltlight={coin.image_link_altlight_o}
          imageLinkSketch={coin.image_link_sketch_o}
          legendExpanded={coin.legend_o_expanded || coin.legend_o}
          legendTranslation={coin.legend_o_translation}
          description={coin.desc_o}
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
          description={coin.desc_r}
        />
      )}

      {/* Map Section */}
      {shouldShowMap && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="w-full">
            {matchingTimeline ? (
              <TimelineWithMap
                timeline={matchingTimeline}
                showHeaders={false}
                initialCenter={mapCenter}
                eventZoomLevel={6}
                additionalMarkers={artifactMarkers}
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
            ) : artifactMarkers.length > 0 ? (
              <div className="space-y-4">
                <Map
                  center={mapCenter}
                  hideControls
                  showMintMarkers={false}
                  customMarkers={artifactMarkers}
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
      {coin.flavour_text && <FlavorFooter flavourText={coin.flavour_text} />}
    </section>
  )
}

function FlavorFooter({ flavourText }: { flavourText: string }) {
  return (
    <footer className="mt-4 border-t border-slate-600 pt-4">
      <p className="text-center text-xs leading-relaxed break-words text-slate-400 italic">
        {flavourText}
      </p>
    </footer>
  )
}
