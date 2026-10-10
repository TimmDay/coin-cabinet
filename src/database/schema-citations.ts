/**
 * A citation backing a fact on a place, mint, device, deity, person, artifact or
 * timeline event: a `citations` row, pointing at a Work (author and title,
 * entered once) and the place in it. See the ingestion repo's GLOSSARY.md and
 * docs/adr/0001-works-and-editions.md.
 */
export type Citation = {
  /** The `citations` row. */
  id: number
  /** The Work's author: "Unknown" when there is none. */
  author: string
  /** The Work's title. */
  title: string
  /** Where in the Work, written the way it is cited (e.g. "78.4.2"). Null: the whole Work. */
  locator: string | null
  /** Where to read it: the URL of the Edition cited, or else the Work's preferred one. */
  url: string | null
  /** What this reference supports on this particular thing (`citations.applies_to`). */
  note: string | null
}

/** How a citation reads: "Cassius Dio, Roman History, 78.4.2". */
export function citationText(citation: Citation): string {
  return [citation.author, citation.title, citation.locator]
    .filter((part) => part !== null && part !== "")
    .join(", ")
}
