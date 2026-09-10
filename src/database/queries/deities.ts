import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Deity } from "~/database/schema-deities"

type DeviceRow = Database["public"]["Tables"]["devices"]["Row"]

export async function fetchDeities(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Deity[]>> {
  const { data: deities, error: deitiesError } = await supabase
    .from("deities")
    .select("*")
    .order("name", { ascending: true })

  if (deitiesError) return { data: null, error: deitiesError }

  const deityIds = deities.map((d) => d.id)

  const { data: deityPlaces, error: deityPlacesError } = await supabase
    .from("deity_places")
    .select("*")
    .in("deity_id", deityIds)

  if (deityPlacesError) return { data: null, error: deityPlacesError }

  const { data: deviceDeities, error: deviceDeitiesError } = await supabase
    .from("device_deities")
    .select("*")
    .in("deity_id", deityIds)

  if (deviceDeitiesError) return { data: null, error: deviceDeitiesError }

  const deviceIds = [...new Set(deviceDeities.map((dd) => dd.device_id))]
  const { data: devices, error: devicesError } =
    deviceIds.length > 0
      ? await supabase.from("devices").select("*").in("id", deviceIds)
      : { data: [] as DeviceRow[], error: null }

  if (devicesError) return { data: null, error: devicesError }

  const deviceById = new Map(devices.map((d) => [d.id, d]))

  const placesByDeityId = new Map<number, number[]>()
  for (const dp of deityPlaces) {
    const list = placesByDeityId.get(dp.deity_id) ?? []
    list.push(dp.place_id)
    placesByDeityId.set(dp.deity_id, list)
  }

  const devicesByDeityId = new Map<number, string[]>()
  for (const dd of deviceDeities) {
    const device = deviceById.get(dd.device_id)
    if (!device) continue
    const list = devicesByDeityId.get(dd.deity_id) ?? []
    list.push(device.name)
    devicesByDeityId.set(dd.deity_id, list)
  }

  const result: Deity[] = deities.map((row) => ({
    id: row.id,
    name: row.name,
    subtitle: row.subtitle ?? undefined,
    alt_names: row.alt_names ?? undefined,
    similar_gods: row.similar_gods ?? undefined,
    flavour_text: row.flavour_text,
    secondary_info: row.secondary_info,
    historical_sources: row.historical_sources ?? undefined,
    god_of: row.god_of ?? [],
    // Replaces the old `features_coinage` (JSONB objects) — its data was
    // migrated into `device_deities` rows, see docs/SCHEMA_MIGRATION_READ_PATH.md.
    features_coinage: (devicesByDeityId.get(row.id) ?? []).map((name) => ({
      name,
    })),
    legends_coinage: row.legends_coinage ?? [],
    place_ids: placesByDeityId.get(row.id) ?? [],
    festivals: (row.festivals ?? []).map((name) => ({ name })),
    artifact_ids: [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: "",
  }))

  return { data: result, error: null }
}
