import type { SupabaseClient } from "@supabase/supabase-js"
import type { Event, EventKind } from "~/data/timelines/types"
import { withUniversalEvents } from "~/data/timelines/universal"
import type { Database } from "~/database/database.types"
import { fetchCitations } from "~/database/queries/citations"
import type { QueryResult } from "~/database/queries/types"
import type { Citation } from "~/database/schema-citations"
import type { Timeline } from "~/database/schema-timelines"

type TimelineEventRow = Database["public"]["Tables"]["timeline_events"]["Row"]
type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

type DatedEventRow = TimelineEventRow & { event_year: number }

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
  const { data: places, error: placesError } =
    placeIds.length > 0
      ? await supabase.from("places").select("*").in("id", placeIds)
      : { data: [] as PlaceRow[], error: null }

  if (placesError) return { data: null, error: placesError }

  const citations = await fetchCitations(
    supabase,
    "timeline_event_id",
    events.map((e) => e.id),
  )
  if (citations.error) return { data: null, error: citations.error }

  const placeById = new Map(places.map((p) => [p.id, p]))
  const eventsByTimelineId = new Map<number, Event[]>()
  for (const row of events) {
    const event = toEvent(
      row,
      row.place_id ? placeById.get(row.place_id) : undefined,
      citations.data.get(row.id) ?? [],
    )
    const list = eventsByTimelineId.get(row.timeline_id) ?? []
    list.push(event)
    eventsByTimelineId.set(row.timeline_id, list)
  }

  // Events of universal timelines also belong on every other timeline whose
  // first-to-last years contain them. A universal timeline keeps only its own.
  const universalEvents = timelines
    .filter((t) => t.is_universal)
    .flatMap((t) => eventsByTimelineId.get(t.id) ?? [])

  const result: Timeline[] = timelines.map((row) => {
    const own = eventsByTimelineId.get(row.id) ?? []
    return {
      id: row.id,
      name: row.name,
      timeline: row.is_universal
        ? own
        : withUniversalEvents(own, universalEvents),
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_id: "",
    }
  })

  return { data: result, error: null }
}
