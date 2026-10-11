import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import { fetchCitations, noCitations } from "~/database/queries/citations"
import { optionalParts } from "~/database/queries/optional-parts"
import type { QueryResult } from "~/database/queries/types"
import type { Deity } from "~/database/schema-deities"

/**
 * The artifact ids that picture each deity, in artifact id order, as strings.
 * Callers treat it as optional (see optionalParts): a failure leaves the
 * deities without pictures.
 */
export async function fetchDeityArtifactIds(
  supabase: SupabaseClient<Database>,
  deityIds: number[],
): Promise<QueryResult<Map<number, string[]>>> {
  const byDeity = new Map<number, string[]>()
  if (deityIds.length === 0) return { data: byDeity, error: null }

  const { data, error } = await supabase
    .from("deity_artifacts")
    .select("*")
    .in("deity_id", deityIds)

  if (error) return { data: null, error }

  for (const row of [...data].sort((a, b) => a.artifact_id - b.artifact_id)) {
    const list = byDeity.get(row.deity_id) ?? []
    list.push(String(row.artifact_id))
    byDeity.set(row.deity_id, list)
  }
  return { data: byDeity, error: null }
}

/**
 * The names of the devices linked to each deity through `device_deities`, in
 * alphabetical order. The deity card lists them in its footer.
 */
export async function fetchDeityDeviceNames(
  supabase: SupabaseClient<Database>,
  deityIds: number[],
): Promise<QueryResult<Map<number, string[]>>> {
  const byDeity = new Map<number, string[]>()
  if (deityIds.length === 0) return { data: byDeity, error: null }

  const { data: links, error: linksError } = await supabase
    .from("device_deities")
    .select("*")
    .in("deity_id", deityIds)
  if (linksError) return { data: null, error: linksError }

  const deviceIds = [...new Set(links.map((link) => link.device_id))]
  if (deviceIds.length === 0) return { data: byDeity, error: null }

  const { data: devices, error: devicesError } = await supabase
    .from("devices")
    .select("*")
    .in("id", deviceIds)
  if (devicesError) return { data: null, error: devicesError }

  const nameById = new Map(devices.map((d) => [d.id, d.name]))
  for (const link of links) {
    const name = nameById.get(link.device_id)
    if (!name) continue
    byDeity.set(link.deity_id, [...(byDeity.get(link.deity_id) ?? []), name])
  }
  for (const names of byDeity.values()) names.sort((a, b) => a.localeCompare(b))

  return { data: byDeity, error: null }
}

export async function fetchDeities(
  supabase: SupabaseClient<Database>,
): Promise<QueryResult<Deity[]>> {
  const { data: deities, error: deitiesError } = await supabase
    .from("deities")
    .select("*")
    .order("name", { ascending: true })

  if (deitiesError) return { data: null, error: deitiesError }

  const deityIds = deities.map((d) => d.id)

  // Everything beyond the deities themselves is optional
  const parts = optionalParts()
  const deityPlaces = parts.take(
    "deity_places",
    await supabase.from("deity_places").select("*").in("deity_id", deityIds),
    [] as { deity_id: number; place_id: number }[],
  )
  const artifactIdsByDeityId = parts.take(
    "deity_artifacts",
    await fetchDeityArtifactIds(supabase, deityIds),
    new Map<number, string[]>(),
  )
  const citations = parts.take(
    "deity citations",
    await fetchCitations(supabase, "deity_id", deityIds),
    noCitations(),
  )
  const deviceNames = parts.take(
    "deity device names",
    await fetchDeityDeviceNames(supabase, deityIds),
    new Map<number, string[]>(),
  )

  const placesByDeityId = new Map<number, number[]>()
  for (const dp of deityPlaces) {
    const list = placesByDeityId.get(dp.deity_id) ?? []
    list.push(dp.place_id)
    placesByDeityId.set(dp.deity_id, list)
  }

  const result: Deity[] = deities.map((row) => ({
    id: row.id,
    name: row.name,
    subtitle: row.subtitle ?? undefined,
    alt_names: row.alt_names ?? undefined,
    similar_gods: row.similar_gods ?? undefined,
    flavour_text: row.flavour_text,
    secondary_info: row.secondary_info,
    citations: citations.get(row.id) ?? [],
    god_of: row.god_of ?? [],
    // The card footer lists the devices linked through `device_deities`
    // (see docs/READ_PATH.md).
    features_coinage: (deviceNames.get(row.id) ?? []).map((name) => ({
      name,
    })),
    legends_coinage: row.legends_coinage ?? [],
    place_ids: placesByDeityId.get(row.id) ?? [],
    festivals: (row.festivals ?? []).map((name) => ({ name })),
    artifact_ids: artifactIdsByDeityId.get(row.id) ?? [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: "",
  }))

  return { data: result, error: null, partial: parts.partial }
}
