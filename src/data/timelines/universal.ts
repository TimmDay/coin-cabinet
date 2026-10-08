// A universal timeline (for example "Universal Timeline Roman") holds events of
// the wider world. Every other timeline shows the ones that fall between its
// own first and last event, in chronological place, as if they were its own.
// The admin app (somnus-data-ingestion) applies the same rule.

type Orderable = {
  id: number
  event_year: number | null
  year_sequence?: number | string | null
}

/** Year first (undated last), then the number within the year (missing counts as 0), then id. */
export function compareEventOrder(a: Orderable, b: Orderable): number {
  if (a.event_year !== b.event_year) {
    if (a.event_year === null) return 1
    if (b.event_year === null) return -1
    return a.event_year - b.event_year
  }
  const aSeq = Number(a.year_sequence ?? 0)
  const bSeq = Number(b.year_sequence ?? 0)
  if (aSeq !== bSeq) return aSeq - bSeq
  return a.id - b.id
}

/**
 * A timeline's own events plus the universal events dated from the year of its
 * first event to the year of its last, inclusive, in order. Whole years are
 * compared. A timeline with no dated events receives none.
 */
export function withUniversalEvents<T extends Orderable, U extends Orderable>(
  own: T[],
  universal: U[],
): (T | U)[] {
  const years = own
    .map((e) => e.event_year)
    .filter((year): year is number => year !== null)
  if (years.length === 0) return [...own].sort(compareEventOrder)
  const first = Math.min(...years)
  const last = Math.max(...years)
  const inside = universal.filter(
    (e) =>
      e.event_year !== null && e.event_year >= first && e.event_year <= last,
  )
  return [...own, ...inside].sort(compareEventOrder)
}
