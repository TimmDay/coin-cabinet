// A universal timeline (for example "Universal Timeline Roman") holds events of
// the wider world. A timeline links to one, and shows its events dated from the
// timeline's start year to its end year, in chronological place, as if they
// were its own, less any the curator removed from it. The admin app
// (somnus-data-ingestion) applies the same rule.

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

/** The years a timeline covers, inclusive. */
export type Span = { start: number; end: number }

/**
 * A timeline's own events plus the universal events dated inside its span,
 * inclusive, in order. Whole years are compared. Without a span it takes none.
 * A tie on year and number puts the timeline's own event first.
 */
export function withUniversalEvents<T extends Orderable>(
  own: T[],
  universal: T[],
  span: Span | null,
): T[] {
  if (!span) return inEventOrder(own)
  const inside = universal.filter(
    (e) => e.year >= span.start && e.year <= span.end,
  )
  return inEventOrder([...own, ...inside])
}
