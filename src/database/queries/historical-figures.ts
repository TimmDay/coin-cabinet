import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { HistoricalFigure } from "~/database/schema-historical-figures"

type PersonRow = Database["public"]["Tables"]["persons"]["Row"]

function toHistoricalFigure(row: PersonRow): HistoricalFigure {
  return {
    id: row.id,
    name: row.name,
    full_name: row.full_name,
    authority: row.title ?? "",
    reign_start: row.reign_start,
    reign_end: row.reign_end,
    reign_note: row.reign_note,
    birth: row.birth_year,
    death: row.death_year,
    altNames: row.alt_names,
    flavour_text: row.flavour_text,
    historical_sources: [],
    timeline_id: [],
    artifact_ids: [],
    places_id: [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: "",
  }
}

export async function fetchHistoricalFigures(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<HistoricalFigure[]>> {
  const { data, error } = await supabase
    .from("persons")
    .select("*")
    .order("name", { ascending: true })

  if (error) return { data: null, error }
  return { data: data.map(toHistoricalFigure), error: null }
}
