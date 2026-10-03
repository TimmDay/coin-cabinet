import type { CustomMapMarker } from "~/components/map/Map"
import { MAP_BOUNDS } from "~/components/map/mapConfig"
import { pinStyle } from "~/components/map/pinStyle"
import type { Artifact } from "~/database/schema-artifacts"
import type { Deity } from "~/database/schema-deities"
import type { Mint } from "~/database/schema-mints"
import type { Place } from "~/database/schema-places"
import type { Timeline } from "~/database/schema-timelines"
import type { Timeline as TimelineEvents } from "~/data/timelines/types"
import { getArtifactLocationData } from "~/lib/utils/artifact-helpers"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import { addFoundEventToTimeline } from "~/lib/utils/provenance-helpers"
import type { CoinEnhanced } from "~/types/api"

/** The reference data a coin's map is built from. Each may still be loading. */
export type CoinMapReference = {
  timelines?: Timeline[]
  mints?: Mint[]
  places?: Place[]
  deities?: Deity[]
  artifacts?: Artifact[]
}

/**
 * What a coin's deep dive map shows, or `null` when there is nothing to map.
 * `timeline` is the coin's timeline (with its minting and find events added)
 * for the timeline map; `markers` are the pins to draw on top: where the coin
 * was struck, the places and artifacts tied to it, and where it was found.
 * On the timeline map the strip supplies the mint and find pins itself, so
 * `markers` there leaves them out.
 */
export type CoinMap =
  | { kind: "timeline"; timeline: TimelineEvents; markers: CustomMapMarker[] }
  | { kind: "markers"; markers: CustomMapMarker[] }

function isWithinMapBounds(lat: number, lng: number) {
  const [[maxLat, minLng], [minLat, maxLng]] = MAP_BOUNDS.maxBounds

  return lat <= maxLat && lat >= minLat && lng >= minLng && lng <= maxLng
}

function relatedArtifactIds(coin: CoinEnhanced) {
  const ids = new Set<string>()

  for (const deity of coin.deities ?? []) {
    for (const id of deity.artifact_ids ?? []) ids.add(id)
  }
  for (const figure of coin.historical_figures ?? []) {
    for (const id of figure.artifact_ids ?? []) ids.add(id)
  }

  return [...ids]
}

function deityPlaceMarkers(
  coin: CoinEnhanced,
  places: Place[] | undefined,
  allDeities: Deity[] | undefined,
): CustomMapMarker[] {
  if (!places) return []

  const deityIds = (coin.deity_id ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id))

  const deities =
    allDeities?.filter((deity) => deityIds.includes(deity.id)) ??
    coin.deities ??
    []

  const deityNamesByPlaceId = new globalThis.Map<number, Set<string>>()
  for (const deity of deities) {
    for (const rawPlaceId of deity.place_ids ?? []) {
      const placeId =
        typeof rawPlaceId === "number"
          ? rawPlaceId
          : Number.parseInt(String(rawPlaceId), 10)
      if (!Number.isFinite(placeId)) continue

      const names = deityNamesByPlaceId.get(placeId) ?? new Set<string>()
      names.add(deity.name)
      deityNamesByPlaceId.set(placeId, names)
    }
  }

  return [...deityNamesByPlaceId.entries()].flatMap(([placeId, names]) => {
    const place = places.find((candidate) => Number(candidate.id) === placeId)
    const lat = Number(place?.lat)
    const lng = Number(place?.lng)

    if (!place || !Number.isFinite(lat) || !Number.isFinite(lng)) return []
    if (!isWithinMapBounds(lat, lng)) return []

    return [
      {
        id: `deity-place-${place.id}`,
        lat,
        lng,
        title: place.name,
        subtitle: `Associated with ${[...names].join(", ")}`,
        description:
          place.flavour_text ?? place.location_description ?? undefined,
        ...pinStyle("deity-place"),
        sizeScale: 0.67,
        centerDotScale: 0.7,
        showPopup: true,
        zIndexOffset: 200,
      },
    ]
  })
}

function artifactMarkers(
  coin: CoinEnhanced,
  artifacts: Artifact[] | undefined,
  places: Place[] | undefined,
): CustomMapMarker[] {
  return relatedArtifactIds(coin).flatMap((artifactId) => {
    const artifact = artifacts?.find((candidate) => candidate.id === artifactId)
    if (!artifact) return []

    const location = getArtifactLocationData(artifact, places)
    if (location.lat === null || location.lng === null) return []
    if (!isWithinMapBounds(location.lat, location.lng)) return []

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
        ...pinStyle("artifact"),
        showPopup: true,
        zIndexOffset: 50,
      },
    ]
  })
}

function foundMarker(coin: CoinEnhanced): CustomMapMarker[] {
  const found = coin.found_event
  if (!found) return []

  return [
    {
      id: `coin-found-${coin.id}`,
      lat: found.lat,
      lng: found.lng,
      title: "Coin Found",
      subtitle: "This coin was found here",
      description: found.notes ?? undefined,
      ...pinStyle("found"),
      showPopup: true,
      zIndexOffset: 900,
    },
  ]
}

function mintMarker(coin: CoinEnhanced, mints: Mint[] | undefined) {
  if (!coin.mint_id || !mints) return []

  const mint = mints.find((candidate) => candidate.id === coin.mint_id)
  if (!mint?.lat || !mint?.lng || !mint.name) return []

  return [
    {
      id: `coin-mint-${coin.id}`,
      lat: mint.lat,
      lng: mint.lng,
      title: mint.name,
      subtitle: "This coin was minted here",
      description:
        coin.mint_year_earliest !== null &&
        coin.mint_year_earliest !== undefined
          ? `Minted around ${coin.mint_year_earliest}`
          : undefined,
      ...pinStyle("minted"),
      showPopup: true,
      zIndexOffset: 1000,
    },
  ]
}

function coinTimeline(
  coin: CoinEnhanced,
  timelines: Timeline[] | undefined,
  mints: Mint[] | undefined,
): TimelineEvents | null {
  if (!coin.timelines_id?.length || !timelines) return null

  const found = timelines.find((timeline) =>
    coin.timelines_id!.includes(timeline.id),
  )
  if (!found) return null

  const withMint = addCoinMintingEventToTimeline(
    found.timeline,
    {
      denomination: coin.denomination,
      mint_id: coin.mint_id,
      mint_year_earliest: coin.mint_year_earliest,
      mint_year_latest: coin.mint_year_latest,
    },
    mints,
  )
  return addFoundEventToTimeline(withMint, coin.found_event)
}

export function buildCoinMap(
  coin: CoinEnhanced,
  { timelines, mints, places, deities, artifacts }: CoinMapReference,
): CoinMap | null {
  const related = [
    ...deityPlaceMarkers(coin, places, deities),
    ...artifactMarkers(coin, artifacts, places),
  ]

  const timeline = coinTimeline(coin, timelines, mints)
  if (timeline) return { kind: "timeline", timeline, markers: related }

  const markers = [...mintMarker(coin, mints), ...related, ...foundMarker(coin)]
  return markers.length > 0 ? { kind: "markers", markers } : null
}
