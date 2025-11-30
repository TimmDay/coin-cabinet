// ============================================================================
// PLACES - Cities, Temples, Ruins, Museums
// ============================================================================
export type PlaceKind = "city" | "temple" | "ruin" | "museum" | "other"

export type Place = {
  id: number
  kind: PlaceKind
  name: string
  lat: number
  lng: number
  flavour_text?: string | null
  location_description?: string // e.g. North face of the hill, grove of trees, bank of the.
  established_year?: number | null
  historical_sources?: string | null
  host_to?: string[] // events, battles, festivals.

  artifact_ids?: string[]

  created_at: string
  updated_at: string
  user_id: string
}
