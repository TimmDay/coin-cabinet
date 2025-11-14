type EventKind =
  | "birth"
  | "death"
  | "made-emperor"
  | "military"
  | "political"
  | "family"
  | "other"

type Event = {
  kind: EventKind // To choose icon.
  name: string
  year: number
  yearEnd?: number
  description?: string
  place?: string
  lat?: number
  lng?: number
}

export type Timeline = {
  id: string
  events: Event[]
}
