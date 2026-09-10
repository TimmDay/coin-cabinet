import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Place } from "~/database/schema-places"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

function toPlace(row: PlaceRow): Place {
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
    historical_sources: row.historical_sources?.join("; ") ?? null,
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
  return { data: data.map(toPlace), error: null }
}
