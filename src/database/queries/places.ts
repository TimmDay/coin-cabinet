import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import { fetchCitations } from "~/database/queries/citations"
import type { QueryResult } from "~/database/queries/types"
import type { Citation } from "~/database/schema-citations"
import type { Place } from "~/database/schema-places"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

function toPlace(row: PlaceRow, citations: Citation[]): Place {
  return {
    id: row.id,
    kind: row.place_type as Place["kind"],
    name: row.name,
    alt_names: row.alt_names ?? [],
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
    flavour_text: row.flavour_text,
    location_description: row.location_description ?? undefined,
    established_year: row.established_year,
    citations,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: "",
  }
}

export async function fetchPlaces(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Place[]>> {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("name", { ascending: true })

  if (error) return { data: null, error }

  const citations = await fetchCitations(
    supabase,
    "place_id",
    data.map((p) => p.id),
  )
  if (citations.error) return { data: null, error: citations.error }

  return {
    data: data.map((row) => toPlace(row, citations.data.get(row.id) ?? [])),
    error: null,
  }
}
