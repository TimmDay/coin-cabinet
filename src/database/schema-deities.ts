// ============================================================================
// DEITIES - Gods, goddesses, and divine concepts on coins
// ============================================================================
export type CoinageFeature = {
  name: string // "eagle", "thunderbolt"
  alt_name?: string // "aquila", "fulmen"
  notes?: string // "often perched on scepter"
}

export type Deity = {
  id: number
  name: string // The display name for the card
  subtitle?: string
  alt_names?: string[] //  a list of names to search against. include the main one
  similar_gods?: string[] // similar gods from other civilizations
  flavour_text?: string | null
  secondary_info?: string | null
  historical_sources?: string[] //TODO: need a type for historical sources objects
  god_of: string[]
  features_coinage: CoinageFeature[] // TODO: work out how to get the forms to handle the JSONB
  legends_coinage: string[]
  temples: string[] // TODO: update to type Place (with kind 'temple')
  festivals: string[] // TODO: tighter type: {name: string, date: string (mm/dd), place: Place}
  artifact_ids: string[] // For joining to future artifacts table - museum pieces, statues, etc.
  created_at: string
  updated_at: string
  user_id: string
}
