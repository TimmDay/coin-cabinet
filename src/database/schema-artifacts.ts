import type { Citation } from "./schema-citations"

export type Artifact = {
  id: string
  name: string
  img_src: string | null
  img_alt: string | null
  /** Who to credit for the image. */
  img_credit: string | null
  place_id: string | null
  institution_name: string | null
  location_name: string | null
  lat: number | null
  lng: number | null
  medium: string | null
  artist_designer: string | null
  year_of_creation_estimate: number | null
  flavour_text: string | null
  historical_notes: string | null
  citations?: Citation[]
  created_at: string
  updated_at: string
}

/**
 * Where an artifact is, for a reader: the place that holds it, then the
 * location note when there is one ("J Paul Getty Museum, California USA").
 */
export function artifactLocation(
  artifact: Pick<Artifact, "institution_name" | "location_name">,
): string | undefined {
  return (
    [artifact.institution_name, artifact.location_name]
      .filter(Boolean)
      .join(", ") || undefined
  )
}

export type ArtifactInsert = {
  name: string
  img_src?: string | null
  img_alt?: string | null
  img_credit?: string | null
  place_id?: string | null
  institution_name?: string | null
  location_name?: string | null
  lat?: number | null
  lng?: number | null
  medium?: string | null
  artist_designer?: string | null
  year_of_creation_estimate?: number | null
  flavour_text?: string | null
  historical_notes?: string | null
}

export type ArtifactUpdate = Partial<ArtifactInsert> & {
  id: string
}
