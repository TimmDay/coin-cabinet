import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import { fetchCitations, noCitations } from "~/database/queries/citations"
import { optionalParts } from "~/database/queries/optional-parts"
import type { QueryResult } from "~/database/queries/types"
import type { Citation } from "~/database/schema-citations"
import type { Device } from "~/database/schema-devices"

type DeviceRow = Database["public"]["Tables"]["devices"]["Row"]

function toDevice(row: DeviceRow, citations: Citation[]): Device {
  return {
    id: String(row.id),
    name: row.name,
    translation: row.translation,
    description: row.description,
    category: row.category,
    citations,
    artifact_ids: [],
    img: row.image_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

/** The devices with the given ids. */
export async function fetchDevices(
  supabase: SupabaseClient<Database>,
  ids: number[],
): Promise<QueryResult<Device[]>> {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .in("id", ids)
    .order("name", { ascending: true })

  if (error) return { data: null, error }

  const parts = optionalParts()
  const citations = parts.take(
    "device citations",
    await fetchCitations(
      supabase,
      "device_id",
      data.map((d) => d.id),
    ),
    noCitations(),
  )

  return {
    data: data.map((row) => toDevice(row, citations.get(row.id) ?? [])),
    error: null,
    partial: parts.partial,
  }
}
