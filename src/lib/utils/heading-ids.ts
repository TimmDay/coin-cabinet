/**
 * Picks an id for a heading that no other heading on the page has used.
 *
 * Keeps the heading's own id if it has one, otherwise builds one from its
 * text ("Historical Context" -> "historical-context"). If that id is taken,
 * numbers it: "historical-context-2", "historical-context-3", and so on. The
 * chosen id is added to `used`.
 */
export function uniqueHeadingId(
  text: string,
  existingId: string,
  used: Set<string>,
): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
  const base = existingId || slug || "section"

  let id = base
  for (let n = 2; used.has(id); n++) {
    id = `${base}-${n}`
  }
  used.add(id)
  return id
}
