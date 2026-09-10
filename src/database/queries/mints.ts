import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Mint } from "~/database/schema-mints"

type OperationPeriodRow =
  Database["public"]["Tables"]["mint_operation_periods"]["Row"]

export async function fetchMints(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Mint[]>> {
  const { data: mints, error: mintsError } = await supabase
    .from("mints")
    .select("*")
    .order("id", { ascending: true })

  if (mintsError) return { data: null, error: mintsError }

  const placeIds = [...new Set(mints.map((m) => m.place_id))]
  const { data: places, error: placesError } = await supabase
    .from("places")
    .select("*")
    .in("id", placeIds)

  if (placesError) return { data: null, error: placesError }

  const mintIds = mints.map((m) => m.id)
  const { data: periods, error: periodsError } = await supabase
    .from("mint_operation_periods")
    .select("*")
    .in("mint_id", mintIds)

  if (periodsError) return { data: null, error: periodsError }

  const placeById = new Map(places.map((p) => [p.id, p]))
  const periodsByMintId = new Map<number, OperationPeriodRow[]>()
  for (const period of periods) {
    const list = periodsByMintId.get(period.mint_id) ?? []
    list.push(period)
    periodsByMintId.set(period.mint_id, list)
  }

  const result: Mint[] = mints
    .map((mint) => {
      const place = placeById.get(mint.place_id)
      if (!place) return null

      const operationPeriods = (periodsByMintId.get(mint.id) ?? []).map(
        (p): [number, number, string] => [
          p.period_start ?? 0,
          p.period_end ?? 0,
          p.authority_label ?? "",
        ],
      )

      const mapped: Mint = {
        id: mint.id,
        name: place.name,
        alt_names: place.alt_names ?? undefined,
        lat: place.lat ?? 0,
        lng: place.lng ?? 0,
        mint_marks: mint.mint_marks ?? undefined,
        officina_marks: mint.officina_marks ?? undefined,
        flavour_text: mint.flavour_text,
        historical_sources: mint.historical_sources ?? undefined,
        opened_by: mint.opened_by,
        operation_periods: operationPeriods.length ? operationPeriods : null,
        coinage_materials: mint.coinage_materials ?? undefined,
        created_at: mint.created_at,
        updated_at: mint.updated_at,
        user_id: "",
      }
      return mapped
    })
    .filter((m): m is Mint => m !== null)
    .sort((a, b) => a.name.localeCompare(b.name))

  return { data: result, error: null }
}
