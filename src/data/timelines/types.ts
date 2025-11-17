export type EventKind =
  | "birth"
  | "death"
  | "made-emperor"
  | "military"
  | "political"
  | "family"
  | "coin-minted" // added dynamically to the list on coin detail pages.
  | "other"

export type Event = {
  kind: EventKind // To choose icon.
  name: string
  year: number
  yearEnd?: number
  description?: string
  source?: string
  place?: string
  lat?: number
  lng?: number
}

export type Timeline = Event[]
