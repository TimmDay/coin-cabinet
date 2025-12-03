// ============================================================================
// HISTORICAL FIGURES - Emperors, empresses, and other historical figures
// ============================================================================
export type HistoricalSource = {
  citation: string // "Suetonius, Lives of the Caesars, Augustus 28"
  notes?: string // "describes the monetary reforms"
}

export type HistoricalFigure = {
  id: number
  name: string
  full_name?: string | null // "Marcus Julius Philippus"
  authority: string // "Emperor", "Augusta", "Caesar"
  reign_start?: number | null
  reign_end?: number | null
  reign_note?: string | null // reigned twice (Maximian), interrupted by usurper, had a co-emperor...
  birth?: number | null
  death?: number | null
  dynasty?: string | null
  flavour_text?: string | null
  historical_sources: HistoricalSource[] // Academic citations

  // Joins
  timeline_id?: number[] | null // join on timelines database
  artifacts_id?: number[] | null // join on artifacts database
  places_id?: number[] | null // join on places database

  created_at: string
  updated_at: string
  user_id: string
}
