// A universal timeline (for example "Universal Timeline Roman") holds events of
// the wider world. Every other timeline shows the ones that fall between its
// own first and last event, in chronological place, as if they were its own.
// The admin app (somnus-data-ingestion) applies the same rule.

type Orderable = { year: number; sequence: number }

/** Year first, then the number within the year. */
export function compareEventOrder(a: Orderable, b: Orderable): number {
  return a.year - b.year || a.sequence - b.sequence
}

/**
 * Events in timeline order. The sort is stable, so events that tie on year and
 * number keep the order they were given in.
 */
export function inEventOrder<T extends Orderable>(events: T[]): T[] {
  return [...events].sort(compareEventOrder)
}

/**
 * A timeline's own events plus the universal events dated from the year of its
 * first event to the year of its last, inclusive, in order. Whole years are
 * compared. A tie on year and number puts the timeline's own event first.
 */
export function withUniversalEvents<T extends Orderable>(
  own: T[],
  universal: T[],
): T[] {
  if (own.length === 0) return []
  const years = own.map((e) => e.year)
  const first = Math.min(...years)
  const last = Math.max(...years)
  const inside = universal.filter((e) => e.year >= first && e.year <= last)
  return inEventOrder([...own, ...inside])
}
