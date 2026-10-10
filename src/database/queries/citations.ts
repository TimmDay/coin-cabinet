import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Citation } from "~/database/schema-citations"

/** The `citations` column that points at each kind of thing. */
export type CitationLink =
  | "place_id"
  | "mint_id"
  | "device_id"
  | "deity_id"
  | "person_id"
  | "artifact_id"
  | "timeline_event_id"

type EditionRow = { id: number; is_preferred: boolean; url: string | null }

type CitationRow = {
  id: number
  locator: string | null
  applies_to: string | null
  edition_id: number | null
  works: {
    author: string
    title: string
    work_editions: EditionRow[] | null
  } | null
} & Partial<Record<CitationLink, number | null>>

/** The Edition a citation links to: the one it names, else the Work's preferred one. */
function editionUrl(row: CitationRow): string | null {
  const editions = row.works?.work_editions ?? []
  const edition =
    editions.find((e) => e.id === row.edition_id) ??
    editions.find((e) => e.is_preferred)
  return edition?.url ?? null
}

/**
 * Groups citation rows by the thing they cite for, in the order they were
 * added. A row whose Work is missing, or that has no id for this column, is
 * skipped.
 */
export function groupCitations(
  rows: CitationRow[],
  column: CitationLink,
): Map<number, Citation[]> {
  const byId = new Map<number, Citation[]>()
  for (const row of [...rows].sort((a, b) => a.id - b.id)) {
    const ownerId = row[column]
    if (ownerId === null || ownerId === undefined || !row.works) continue
    const list = byId.get(ownerId) ?? []
    list.push({
      id: row.id,
      author: row.works.author,
      title: row.works.title,
      locator: row.locator,
      url: editionUrl(row),
      note: row.applies_to,
    })
    byId.set(ownerId, list)
  }
  return byId
}

/**
 * The citations for a set of things (all places, say), as a map from each
 * thing's id to its list. A thing with no citations has no entry.
 */
export async function fetchCitations(
  supabase: SupabaseClient<Database>,
  column: CitationLink,
  ids: number[],
): Promise<QueryResult<Map<number, Citation[]>>> {
  if (ids.length === 0) return { data: new Map(), error: null }

  const { data, error } = await supabase
    .from("citations")
    .select(
      `id, locator, applies_to, edition_id, ${column}, works(author, title, work_editions(id, is_preferred, url))`,
    )
    .in(column, ids)
    .order("id", { ascending: true })
    .returns<CitationRow[]>()

  if (error) return { data: null, error }
  return { data: groupCitations(data, column), error: null }
}
