export type Artifact = {
  id: string
  name: string
  img_src: string | null
  img_alt: string | null
  institution_name: string | null
  location_name: string | null
  lat: number | null
  lng: number | null
  medium: string | null
  artist_designer: string | null
  year_of_creation_estimate: number | null
  flavour_text: string | null
  historical_notes: string | null
  historical_sources: string[] | null
  created_at: string
  updated_at: string
}

export type ArtifactInsert = {
  name: string
  img_src?: string | null
  img_alt?: string | null
  institution_name?: string | null
  location_name?: string | null
  lat?: number | null
  lng?: number | null
  medium?: string | null
  artist_designer?: string | null
  year_of_creation_estimate?: number | null
  flavour_text?: string | null
  historical_notes?: string | null
  historical_sources?: string[] | null
}

export type ArtifactUpdate = Partial<ArtifactInsert> & {
  id: string
}
