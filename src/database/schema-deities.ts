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
  name: string // "Jupiter", "Mars", "Victoria"
  subtitle?: string // "King of the Gods", "God of War" - short descriptive subtitle
  alt_names?: string[] // ["Jove", "Optimus Maximus"] - alternative names and epithets
  similar_gods?: string[] // ["Zeus", "Ammon"] - equivalent gods from other civilizations
  flavour_text?: string | null // Rich description of the deity's role and significance
  secondary_info?: string | null // Additional descriptive information for display
  historical_sources?: string[] // ["Ovid Metamorphoses 1.163", "Pliny Natural History 2.7"] - formatted academic sources
  god_of: string[] // ["sky", "thunder", "justice", "state"] - domains and responsibilities
  features_coinage: CoinageFeature[] // Detailed features on coins with names, alt names, and notes
  legends_coinage: string[] // ["IOM", "IOVI OPTIMO MAXIMO", "CONSERVATORI"] - common abbreviations and legends
  artifact_ids: string[] // For joining to future artifacts table - museum pieces, statues, etc.
  created_at: string
  updated_at: string
  user_id: string
}
