// ============================================================================
// TIMELINES
// ============================================================================

export type EventKind =
  | "birth"
  | "death"
  | "made-emperor"
  | "military"
  | "political"
  | "family"
  | "coin-minted" // Added dynamically to timelines on coin detail pages
  | "unrest"
  | "other"

// Individual events in historical timelines
export type TimelineEvent = {
  id: number
  event_kind: EventKind
  title: string // 2 or 3 word summary
  description?: string | null
  year: number // negative for BCE
  year_end?: number | null // For multi-year events (wars, etc.)
  historical_sources?: string[] | null // Academic citations

  created_at: string
  updated_at: string
  user_id: string

  // Joins
  place_id?: string | null // join on places database. has lat/lng etc
  //artifacts?
}
