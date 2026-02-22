// ============================================================================
// HISTORICAL FIGURES - Emperors, empresses, and other historical figures
// ============================================================================

import type { HistoricalSource } from "./types.ts"

export type HistoricalFigure = {
  id: number
  name: string
  full_name?: string | null // "Marcus Julius Philippus"
  authority: string // "Emperor", "Augusta", "Caesar"
  reign_start?: number | null //relating to this authority
  reign_end?: number | null
  reign_note?: string | null // reigned twice (Maximian), interrupted by usurper, had a co-emperor...
  birth?: number | null
  death?: number | null
  altNames?: string[] | null
  flavour_text?: string | null
  historical_sources: HistoricalSource[] // Academic citations

  // Joins
  timeline_id?: number[] | null // join on timelines database
  artifact_ids?: string[] | null // join on artifacts database (TEXT[] in DB)
  places_id?: number[] | null // join on places database

  created_at: string
  updated_at: string
  user_id: string
}
