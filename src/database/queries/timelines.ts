import type { SupabaseClient } from "@supabase/supabase-js"
import type { Event, EventKind } from "~/data/timelines/types"
import { type Span, withUniversalEvents } from "~/data/timelines/universal"
import type { Database } from "~/database/database.types"
import { fetchCitations, noCitations } from "~/database/queries/citations"
import { optionalParts } from "~/database/queries/optional-parts"
import type { QueryResult } from "~/database/queries/types"
import type { Citation } from "~/database/schema-citations"
import type { Timeline } from "~/database/schema-timelines"

type TimelineEventRow = Database["public"]["Tables"]["timeline_events"]["Row"]
type PlaceRow = Database["public"]["Tables"]["places"]["Row"]
type TimelineRow = Database["public"]["Tables"]["timelines"]["Row"]
type RemovedRow =
  Database["public"]["Tables"]["timeline_hidden_universal_events"]["Row"]

type DatedEventRow = TimelineEventRow & { event_year: number }

/** The years a timeline covers, or null if either end is unset. */
function spanOf(row: TimelineRow): Span | null {
  if (row.start_year === null || row.end_year === null) return null
  return { start: row.start_year, end: row.end_year }
}

function toEvent(
  row: DatedEventRow,
  place: PlaceRow | undefined,
  citations: Citation[],
): Event {
  return {
    kind: row.event_type as EventKind,
    name: row.name,
    year: row.event_year,
    sequence: row.year_sequence,
    description: row.flavour_text ?? undefined,
    citations,
    place: place?.name ?? row.location_note ?? undefined,
    place_id: row.place_id !== null ? String(row.place_id) : undefined,
    lat: row.lat ?? place?.lat ?? undefined,
    lng: row.lng ?? place?.lng ?? undefined,
  }
}

export async function fetchTimelines(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Timeline[]>> {
  const { data: timelines, error: timelinesError } = await supabase
    .from("timelines")
    .select("*")
    .order("name", { ascending: true })

  if (timelinesError) return { data: null, error: timelinesError }

  const timelineIds = timelines.map((t) => t.id)
  const { data: eventRows, error: eventsError } = await supabase
    .from("timeline_events")
    .select("*")
    .in("timeline_id", timelineIds)
    // Year, then the 1 to 12 number within the year; id keeps ties steady
    .order("event_year", { ascending: true })
    .order("year_sequence", { ascending: true })
    .order("id", { ascending: true })

  if (eventsError) return { data: null, error: eventsError }

  // An event without a year is incomplete, and a timeline cannot place it.
  const events = eventRows.filter(
    (e): e is DatedEventRow => e.event_year !== null,
  )

  const placeIds = [
    ...new Set(
      events.map((e) => e.place_id).filter((id): id is number => id !== null),
    ),
  ]
  // The places only name an event's place and stand in for its position
  const parts = optionalParts()
  const places = parts.take(
    "timeline event places",
    placeIds.length > 0
      ? await supabase.from("places").select("*").in("id", placeIds)
      : { data: [] as PlaceRow[], error: null },
    [] as PlaceRow[],
  )
  const citations = parts.take(
    "timeline event citations",
    await fetchCitations(
      supabase,
      "timeline_event_id",
      events.map((e) => e.id),
    ),
    noCitations(),
  )
  // The universal events the curator removed from each timeline. If this
  // fails they show for now, and the read is not cached.
  const removedRows = parts.take(
    "timeline removed universal events",
    await supabase
      .from("timeline_hidden_universal_events")
      .select("*")
      .in("timeline_id", timelineIds),
    [] as RemovedRow[],
  )
  const removedByTimelineId = new Map<number, Set<number>>()
  for (const row of removedRows) {
    const ids = removedByTimelineId.get(row.timeline_id) ?? new Set<number>()
    ids.add(row.timeline_event_id)
    removedByTimelineId.set(row.timeline_id, ids)
  }

  const placeById = new Map(places.map((p) => [p.id, p]))
  // Kept with their ids, to leave out the removed universal ones
  const eventsByTimelineId = new Map<number, { id: number; event: Event }[]>()
  for (const row of events) {
    const event = toEvent(
      row,
      row.place_id ? placeById.get(row.place_id) : undefined,
      citations.get(row.id) ?? [],
    )
    const list = eventsByTimelineId.get(row.timeline_id) ?? []
    list.push({ id: row.id, event })
    eventsByTimelineId.set(row.timeline_id, list)
  }
  const eventsOf = (timelineId: number) =>
    (eventsByTimelineId.get(timelineId) ?? []).map((e) => e.event)

  // A timeline also shows the events of the universal timeline it links to,
  // inside its years, less the removed ones. A universal timeline keeps only
  // its own.
  const result: Timeline[] = timelines.map((row) => {
    const own = eventsOf(row.id)
    const removed = removedByTimelineId.get(row.id)
    const universal =
      row.universal_timeline_id === null
        ? []
        : (eventsByTimelineId.get(row.universal_timeline_id) ?? [])
            .filter((e) => !removed?.has(e.id))
            .map((e) => e.event)
    return {
      id: row.id,
      name: row.name,
      timeline: row.is_universal
        ? own
        : withUniversalEvents(own, universal, spanOf(row)),
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_id: "",
    }
  })

  return { data: result, error: null, partial: parts.partial }
}
