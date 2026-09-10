import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Artifact } from "~/database/schema-artifacts"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

export async function fetchArtifacts(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Artifact[]>> {
  const { data: artifacts, error: artifactsError } = await supabase
    .from("artifacts")
    .select("*")
    .order("name", { ascending: true })

  if (artifactsError) return { data: null, error: artifactsError }

  const placeIds = [
    ...new Set(
      artifacts
        .map((a) => a.place_id)
        .filter((id): id is number => id !== null),
    ),
  ]

  const { data: places, error: placesError } =
    placeIds.length > 0
      ? await supabase.from("places").select("*").in("id", placeIds)
      : { data: [] as PlaceRow[], error: null }

  if (placesError) return { data: null, error: placesError }

  const placeById = new Map(places.map((p) => [p.id, p]))

  const result: Artifact[] = artifacts.map((row) => {
    const place = row.place_id ? placeById.get(row.place_id) : undefined
    return {
      id: String(row.id),
      name: row.name,
      img_src: row.image_url,
      img_alt: row.image_alt_text,
      place_id: row.place_id !== null ? String(row.place_id) : null,
      institution_name: place?.name ?? null,
      location_name: row.location_note,
      lat: place?.lat ?? null,
      lng: place?.lng ?? null,
      medium: row.medium,
      artist_designer: row.artist_designer,
      year_of_creation_estimate: row.year_of_creation_estimate,
      flavour_text: row.flavour_text,
      historical_notes: row.historical_notes,
      historical_sources: row.historical_sources,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  })

  return { data: result, error: null }
}
