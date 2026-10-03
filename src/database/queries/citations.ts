import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import type { Citation } from "~/database/schema-citations"

/** The `entity_sources` column that points at each kind of thing. */
export type CitationLink =
  | "place_id"
  | "mint_id"
  | "device_id"
  | "deity_id"
  | "person_id"
  | "artifact_id"
  | "timeline_event_id"

type LinkRow = {
  id: number
  applies_to: string | null
  sources: {
    id: number
    author: string | null
    work_title: string | null
    citation: string
    url: string | null
  } | null
} & Partial<Record<CitationLink, number | null>>

/**
 * Groups link rows by the thing they cite for, in link order. A link whose source
 * is missing, or that has no id for this column, is skipped.
 */
export function groupCitations(
  rows: LinkRow[],
  column: CitationLink,
): Map<number, Citation[]> {
  const byId = new Map<number, Citation[]>()
  for (const row of [...rows].sort((a, b) => a.id - b.id)) {
    const ownerId = row[column]
    if (ownerId === null || ownerId === undefined || !row.sources) continue
    const list = byId.get(ownerId) ?? []
    list.push({
      id: row.sources.id,
      author: row.sources.author,
      work_title: row.sources.work_title,
      citation: row.sources.citation,
      url: row.sources.url,
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
    .from("entity_sources")
    .select(
      `id, applies_to, ${column}, sources(id, author, work_title, citation, url)`,
    )
    .in(column, ids)
    .order("id", { ascending: true })
    .returns<LinkRow[]>()

  if (error) return { data: null, error }
  return { data: groupCitations(data, column), error: null }
}
