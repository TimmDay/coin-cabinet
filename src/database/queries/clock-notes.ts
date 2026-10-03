import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { ClockNote } from "~/types/api"

type ClockNoteRow = Database["public"]["Tables"]["item_clock_notes"]["Row"]

/** What a linked authority entry contributes to a note. */
export type LinkedEntry = {
  title: string
  body: string | null
  imageUrl?: string | null
}

type LinkKind = "device" | "deity" | "place" | "person" | "mint" | "artifact"

export type LinkedEntries = Record<LinkKind, Map<number, LinkedEntry>>

const LINK_COLUMNS = {
  device: "device_id",
  deity: "deity_id",
  place: "place_id",
  person: "person_id",
  mint: "mint_id",
  artifact: "artifact_id",
} as const satisfies Record<LinkKind, keyof ClockNoteRow>

const emptyEntries = (): LinkedEntries => ({
  device: new Map(),
  deity: new Map(),
  place: new Map(),
  person: new Map(),
  mint: new Map(),
  artifact: new Map(),
})

/** The note's one authority link, if it has one (the table allows at most one). */
function linkOf(row: ClockNoteRow): { kind: LinkKind; id: number } | null {
  for (const kind of Object.keys(LINK_COLUMNS) as LinkKind[]) {
    const id = row[LINK_COLUMNS[kind]]
    if (id !== null) return { kind, id }
  }
  return null
}

/**
 * Turns rows into the notes the page shows. Text written on the note wins;
 * a linked entry fills in whatever is missing. A note with nothing to show
 * (no text of its own, and its linked entry missing or hidden) is dropped.
 */
export function resolveClockNotes(
  rows: ClockNoteRow[],
  entries: LinkedEntries,
): ClockNote[] {
  const notes: ClockNote[] = []

  for (const row of rows) {
    if (row.side !== "obverse" && row.side !== "reverse") continue

    const link = linkOf(row)
    const entry = link ? entries[link.kind].get(link.id) : undefined
    const title = row.title ?? entry?.title ?? null
    const body = row.body ?? entry?.body ?? null
    if (title === null && body === null) continue

    notes.push({
      side: row.side,
      position: row.clock_position,
      title,
      body,
      linkUrl: row.link_url,
      linkLabel: row.link_label,
      imageUrl: entry?.imageUrl ?? null,
      iconType: row.icon_type,
    })
  }

  return notes.sort(
    (a, b) => a.side.localeCompare(b.side) || a.position - b.position,
  )
}

type NamedRow = { id: number; name: string; flavour_text: string | null }

/** Fetches the entries the notes link to, one query per kind that is used. */
async function fetchLinkedEntries(
  supabase: SupabaseClient<Database>,
  rows: ClockNoteRow[],
): Promise<QueryResult<LinkedEntries>> {
  const ids = (kind: LinkKind) => [
    ...new Set(
      rows
        .map((row) => row[LINK_COLUMNS[kind]])
        .filter((id): id is number => id !== null),
    ),
  ]

  const named = async (
    table: "deities" | "places" | "persons",
    kind: LinkKind,
  ) => {
    const wanted = ids(kind)
    if (wanted.length === 0) return { data: [] as NamedRow[], error: null }
    return supabase
      .from(table)
      .select("id, name, flavour_text")
      .in("id", wanted)
      .returns<NamedRow[]>()
  }

  const deviceIds = ids("device")
  const mintIds = ids("mint")
  const artifactIds = ids("artifact")

  const [devices, deities, places, persons, artifacts, mints] =
    await Promise.all([
      deviceIds.length > 0
        ? supabase
            .from("devices")
            .select("id, name, description, image_url")
            .in("id", deviceIds)
            .returns<
              {
                id: number
                name: string
                description: string
                image_url: string | null
              }[]
            >()
        : Promise.resolve({ data: [], error: null }),
      named("deities", "deity"),
      named("places", "place"),
      named("persons", "person"),
      artifactIds.length > 0
        ? supabase
            .from("artifacts")
            .select("id, name, flavour_text, image_url")
            .in("id", artifactIds)
            .returns<(NamedRow & { image_url: string | null })[]>()
        : Promise.resolve({ data: [], error: null }),
      // A mint has no name of its own: it is its place
      mintIds.length > 0
        ? supabase
            .from("mints")
            .select("id, flavour_text, places(name)")
            .in("id", mintIds)
            .returns<
              {
                id: number
                flavour_text: string | null
                places: { name: string } | null
              }[]
            >()
        : Promise.resolve({ data: [], error: null }),
    ])

  for (const { error } of [
    devices,
    deities,
    places,
    persons,
    artifacts,
    mints,
  ]) {
    if (error) return { data: null, error }
  }

  const entries = emptyEntries()
  for (const d of devices.data ?? []) {
    entries.device.set(d.id, {
      title: d.name,
      body: d.description,
      imageUrl: d.image_url,
    })
  }
  const byKind = {
    deity: deities,
    place: places,
    person: persons,
  }
  for (const [kind, result] of Object.entries(byKind) as [
    keyof typeof byKind,
    typeof deities,
  ][]) {
    for (const row of result.data ?? []) {
      entries[kind].set(row.id, { title: row.name, body: row.flavour_text })
    }
  }
  for (const a of artifacts.data ?? []) {
    entries.artifact.set(a.id, {
      title: a.name,
      body: a.flavour_text,
      imageUrl: a.image_url,
    })
  }
  for (const m of mints.data ?? []) {
    if (m.places) {
      entries.mint.set(m.id, { title: m.places.name, body: m.flavour_text })
    }
  }

  return { data: entries, error: null }
}

/** The clock notes for one item, with linked entries resolved. */
export async function fetchClockNotes(
  supabase: SupabaseClient<Database>,
  itemId: number,
): Promise<QueryResult<ClockNote[]>> {
  const { data: rows, error } = await supabase
    .from("item_clock_notes")
    .select("*")
    .eq("item_id", itemId)
    .returns<ClockNoteRow[]>()

  if (error) return { data: null, error }
  if (rows.length === 0) return { data: [], error: null }

  const entries = await fetchLinkedEntries(supabase, rows)
  if (entries.error) return { data: null, error: entries.error }

  return { data: resolveClockNotes(rows, entries.data), error: null }
}
