import type { Event as TimelineEvent, Timeline } from "~/data/timelines/types"
import type { CoinEnhanced } from "~/types/api"

type FoundEvent = NonNullable<CoinEnhanced["found_event"]>

/**
 * Extracts a rough year from provenance_events.event_date, which is
 * fuzzy-date free text (e.g. "circa 1980s", "2019-05-01") rather than a
 * structured date. Good enough to place the found event on a chronological
 * axis, not meant to be precise.
 */
function parseFuzzyYear(dateText: string | null): number | null {
  if (!dateText) return null
  const match = /-?\d{3,4}/.exec(dateText)
  return match ? Number(match[0]) : null
}

/**
 * Builds a "found" timeline event from a coin's found-location provenance
 * data, or null if there's no usable date to plot. Timeline.tsx renders
 * this kind as a fixed marker off to the right of the axis rather than
 * scaled into it -- find dates are typically 1000s of years after the
 * coin's own historical events and would wreck the scale otherwise.
 */
export function createFoundTimelineEvent(
  foundEvent: FoundEvent | null | undefined,
): TimelineEvent | null {
  if (!foundEvent) return null

  const year = parseFuzzyYear(foundEvent.event_date)
  if (year === null) return null

  return {
    kind: "found",
    name: "Coin Found",
    year,
    description: foundEvent.notes ?? undefined,
    lat: foundEvent.lat,
    lng: foundEvent.lng,
  }
}

/**
 * Appends the found event to a timeline, if there is one to add. Always at
 * the end -- find dates are always far later than any historical event on
 * the timeline, so this matches where it would naturally sort anyway.
 */
export function addFoundEventToTimeline(
  timeline: Timeline,
  foundEvent: FoundEvent | null | undefined,
): Timeline {
  const event = createFoundTimelineEvent(foundEvent)
  return event ? [...timeline, event] : timeline
}
