import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Device } from "~/database/schema-devices"

type DeviceRow = Database["public"]["Tables"]["devices"]["Row"]

function toDevice(row: DeviceRow): Device {
  return {
    id: String(row.id),
    name: row.name,
    translation: row.translation,
    description: row.description,
    category: row.category,
    sources: row.historical_sources ?? [],
    artifact_ids: [],
    img: row.image_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function fetchDevices(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Device[]>> {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .order("name", { ascending: true })

  if (error) return { data: null, error }
  return { data: data.map(toDevice), error: null }
}
