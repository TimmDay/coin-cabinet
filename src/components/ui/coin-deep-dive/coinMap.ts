import type { CustomMapMarker } from "~/components/map/Map"
import { parseMapPosition } from "~/components/map/coordinates"
import { pinStyle } from "~/components/map/pinStyle"
import type { Artifact } from "~/database/schema-artifacts"
import type { Place } from "~/database/schema-places"
import type { Timeline } from "~/database/schema-timelines"
import type { Timeline as TimelineEvents } from "~/data/timelines/types"
import { getArtifactLocationData } from "./artifact-helpers"
import { isYear } from "~/lib/utils/years"
import { coinTimeline, whenMinted } from "./coin-timeline"
import type { CoinEnhanced } from "~/types/api"

/**
 * The reference data a coin's map is built from, beyond the coin itself. Each
 * may still be loading.
 */
export type CoinMapReference = {
  timelines?: Timeline[]
  places?: Place[]
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
export type CoinMap = (
  | { kind: "timeline"; timeline: TimelineEvents; markers: CustomMapMarker[] }
  | { kind: "markers"; markers: CustomMapMarker[] }
) & {
  /**
   * The year the map draws its Jurisdictions at, or null when the coin has no
   * recorded minting year. See `selectedYearForCoin`.
   */
  selectedYear: number | null
}

/**
 * Which year a coin's map should show: the coin's own earliest minting year.
 *
 * A range collapses to its earliest year so the behaviour is predictable
 * rather than arbitrary. There is no year zero (1 BC is followed by AD 1), so
 * a 0 counts as no year. Null means no Jurisdiction layer at all, matching
 * `coinTimeline`, which likewise adds no minting event without a year:
 * drawing some other year's geography beside a coin would be worse than
 * drawing none.
 *
 * The mint's own operating period is deliberately not used. That is when the
 * mint was open, not when this coin was struck.
 */
export function selectedYearForCoin(coin: {
  mint_year_earliest?: number | null
}): number | null {
  const year = coin.mint_year_earliest
  return typeof year === "number" && year !== 0 ? year : null
}

/**
 * The artifacts tied to this coin: the ones in its own supporting images
 * (`flavour_img`), and any a deity or person on it points at.
 */
function relatedArtifactIds(coin: CoinEnhanced) {
  const ids = new Set<string>(coin.flavour_img ?? [])

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
): CustomMapMarker[] {
  if (!places) return []

  const deityNamesByPlaceId = new globalThis.Map<number, Set<string>>()
  for (const deity of coin.deities ?? []) {
    for (const placeId of deity.place_ids) {
      const names = deityNamesByPlaceId.get(placeId) ?? new Set<string>()
      names.add(deity.name)
      deityNamesByPlaceId.set(placeId, names)
    }
  }

  return [...deityNamesByPlaceId.entries()].flatMap(([placeId, names]) => {
    const place = places.find((candidate) => Number(candidate.id) === placeId)
    const position = place && parseMapPosition(place.lat, place.lng)
    if (!place || !position) return []
    const [lat, lng] = position

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
    const position = parseMapPosition(location.lat, location.lng)
    if (!position) return []
    const [lat, lng] = position

    return [
      {
        id: `artifact-${artifact.id}`,
        lat,
        lng,
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
  const position = found && parseMapPosition(found.lat, found.lng)
  if (!found || !position) return []

  return [
    {
      id: `coin-found-${coin.id}`,
      lat: position[0],
      lng: position[1],
      title: "Coin Found",
      subtitle: "This coin was found here",
      description: found.notes ?? undefined,
      ...pinStyle("found"),
      showPopup: true,
      zIndexOffset: 900,
    },
  ]
}

function mintMarker(coin: CoinEnhanced) {
  const mint = coin.mint
  const position = mint && parseMapPosition(mint.lat, mint.lng)
  if (!mint?.name || !position) return []

  return [
    {
      id: `coin-mint-${coin.id}`,
      lat: position[0],
      lng: position[1],
      title: mint.name,
      subtitle: "This coin was minted here",
      description: isYear(coin.mint_year_earliest)
        ? `Minted ${whenMinted(coin.mint_year_earliest, coin.mint_year_latest)}`
        : undefined,
      ...pinStyle("minted"),
      showPopup: true,
      zIndexOffset: 1000,
    },
  ]
}

export function buildCoinMap(
  coin: CoinEnhanced,
  { timelines, places, artifacts }: CoinMapReference,
): CoinMap | null {
  const related = [
    ...deityPlaceMarkers(coin, places),
    ...artifactMarkers(coin, artifacts, places),
  ]

  const selectedYear = selectedYearForCoin(coin)

  const timeline = coinTimeline(coin, timelines)
  if (timeline)
    return { kind: "timeline", timeline, markers: related, selectedYear }

  const markers = [...mintMarker(coin), ...related, ...foundMarker(coin)]
  return markers.length > 0 ? { kind: "markers", markers, selectedYear } : null
}
