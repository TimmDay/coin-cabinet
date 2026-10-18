import type { Event, Timeline as TimelineEvents } from "~/data/timelines/types"
import { inEventOrder } from "~/data/timelines/universal"
import type { Timeline } from "~/database/schema-timelines"
import { formatYear, formatYearRange, isYear } from "~/lib/utils/years"
import type { CoinEnhanced } from "~/types/api"

/** Where a coin's minting sits among the events of its year, on the 1 to 12 scale. */
const MINTING_SEQUENCE = 6

/**
 * A coin's timeline, in order: the events of its timeline, its minting placed
 * among them by year and number like any other event, then its find. Null when
 * the coin has no timeline, or its timeline is not loaded.
 *
 * The minting comes after any event that shares its year and number. The find
 * always comes last: find dates are far later than anything historical, and
 * Timeline.tsx draws it off the scaled axis.
 */
export function coinTimeline(
  coin: CoinEnhanced,
  timelines: Timeline[] | undefined,
): TimelineEvents | null {
  if (!coin.timelines_id?.length || !timelines) return null

  const found = timelines.find((timeline) =>
    coin.timelines_id!.includes(timeline.id),
  )
  if (!found) return null

  const minting = mintingEvent(coin)
  const ordered = inEventOrder(
    minting ? [...found.timeline, minting] : found.timeline,
  )
  const find = foundEvent(coin.found_event)
  return find ? [...ordered, find] : ordered
}

/**
 * When a coin was minted, for a sentence: "approximately 193—211 CE" for a
 * range, "in 193 CE" when both ends agree, and "around 193 CE" when only the
 * earliest year is known.
 */
export function whenMinted(
  earliest: number,
  latest: number | null | undefined,
): string {
  if (!isYear(latest)) return `around ${formatYear(earliest)}`
  if (latest === earliest) return `in ${formatYear(earliest)}`
  return `approximately ${formatYearRange(earliest, latest)}`
}

function mintingEvent(coin: CoinEnhanced): Event | null {
  const earliest = coin.mint_year_earliest
  // There is no year zero (1 BC is followed by AD 1), so 0 is no year at all
  if (!earliest) return null

  const mint = coin.mint
  let description = `This ${coin.denomination} was minted`
  if (mint) description += ` at ${mint.name}`

  description += ` ${whenMinted(earliest, coin.mint_year_latest)}`

  return {
    kind: "coin-minted",
    name: "Coin Minted",
    year: earliest,
    sequence: MINTING_SEQUENCE,
    description,
    source: "",
    place: mint?.name ?? "Unknown mint",
    lat: mint?.lat,
    lng: mint?.lng,
  }
}

type FoundEvent = NonNullable<CoinEnhanced["found_event"]>

/**
 * A rough year from provenance_events.event_date, which is fuzzy free text
 * (e.g. "circa 1980s", "2019-05-01") rather than a structured date. Good enough
 * to place the find on a timeline, not meant to be precise.
 */
function parseFuzzyYear(dateText: string | null): number | null {
  if (!dateText) return null
  const match = /-?\d{3,4}/.exec(dateText)
  return match ? Number(match[0]) : null
}

function foundEvent(found: FoundEvent | null | undefined): Event | null {
  if (!found) return null

  const year = parseFuzzyYear(found.event_date)
  if (year === null) return null

  return {
    kind: "found",
    name: "Coin Found",
    year,
    sequence: 0,
    description: found.notes ?? undefined,
    lat: found.lat,
    lng: found.lng,
  }
}
