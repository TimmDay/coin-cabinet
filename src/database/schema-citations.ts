/**
 * A citation backing a fact on a place, mint, device, deity, person, artifact or
 * timeline event: a row in `sources` linked to the thing through
 * `entity_sources`.
 */
export type Citation = {
  /** The `sources` row. */
  id: number
  author: string | null
  /** The title of the work. */
  work_title: string | null
  /** Where in the work: book, chapter, section, paragraph. */
  citation: string
  /** A link to the passage or an example. */
  url: string | null
  /** What this reference supports on this particular thing (`entity_sources.applies_to`). */
  note: string | null
}
