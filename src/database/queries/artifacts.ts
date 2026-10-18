import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import { fetchCitations, noCitations } from "~/database/queries/citations"
import { optionalParts } from "~/database/queries/optional-parts"
import type { QueryResult } from "~/database/queries/types"
import type { Artifact } from "~/database/schema-artifacts"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

/** Every artifact, or only those with the given ids. */
export async function fetchArtifacts(
  supabase: SupabaseClient<Database>,
  ids?: number[],
): Promise<QueryResult<Artifact[]>> {
  const all = supabase.from("artifacts").select("*")
  const { data: artifacts, error: artifactsError } = await (
    ids ? all.in("id", ids) : all
  ).order("name", { ascending: true })

  if (artifactsError) return { data: null, error: artifactsError }

  const placeIds = [
    ...new Set(
      artifacts
        .map((a) => a.place_id)
        .filter((id): id is number => id !== null),
    ),
  ]

  // The places only add an institution name and a position
  const parts = optionalParts()
  const places = parts.take(
    "artifact places",
    placeIds.length > 0
      ? await supabase.from("places").select("*").in("id", placeIds)
      : { data: [] as PlaceRow[], error: null },
    [] as PlaceRow[],
  )
  const citations = parts.take(
    "artifact citations",
    await fetchCitations(
      supabase,
      "artifact_id",
      artifacts.map((a) => a.id),
    ),
    noCitations(),
  )

  const placeById = new Map(places.map((p) => [p.id, p]))

  const result: Artifact[] = artifacts.map((row) => {
    const place = row.place_id ? placeById.get(row.place_id) : undefined
    return {
      id: String(row.id),
      name: row.name,
      img_src: row.image_url,
      img_alt: row.image_alt_text,
      img_credit: row.image_credit,
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
      citations: citations.get(row.id) ?? [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  })

  return { data: result, error: null, partial: parts.partial }
}
