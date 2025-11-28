export type Mint = {
  id: number
  name: string
  alt_names: string[] // other languages / scripts
  lat: number
  lng: number
  mint_marks: string[] // ["ROMA", "R", "ROM", "RM", "XXIR", "SMR"]
  flavour_text?: string | null // Historical description

  historical_sources: string[] // Academic citations
  opened_by?: string | null // "Augustus", "Republic Temple of Juno Moneta"
  operation_periods?: [number, number, string][] | null // JSONB: [[-260, 476, "Republic"], [195, 197, "Clodius Albinus"]]
  coinage_materials: string[] // ["bronze", "silver", "gold"]

  created_at: string
  updated_at: string
  user_id: string
}
