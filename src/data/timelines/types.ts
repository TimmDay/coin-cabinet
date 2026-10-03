export type EventKind =
  | "birth"
  | "death"
  | "made-emperor"
  | "military"
  | "political"
  | "family"
  | "coin-minted" // added dynamically to the list on coin detail pages.
  | "found" // added dynamically on coin detail pages; rendered off the scaled axis, see Timeline.tsx.
  | "unrest"
  | "other"

import type { Citation } from "~/database/schema-citations"

export type Event = {
  kind: EventKind // To choose icon.
  name: string
  year: number
  yearEnd?: number
  description?: string
  /** A free-text source, for the hand-written timelines. */
  source?: string
  /** Citations from the database (`sources` through `entity_sources`). */
  citations?: Citation[]
  place?: string
  place_id?: string // Reference to place ID from places table
  lat?: number
  lng?: number
}

export type Timeline = Event[]
