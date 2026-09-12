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

export type Event = {
  kind: EventKind // To choose icon.
  name: string
  year: number
  yearEnd?: number
  description?: string
  source?: string
  place?: string
  place_id?: string // Reference to place ID from places table
  lat?: number
  lng?: number
}

export type Timeline = Event[]
