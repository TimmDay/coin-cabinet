/**
 * True if a coin could have been minted within a year range: the coin's mint
 * range overlaps [start, end]. Either bound may be null for an open end, and
 * with both null every coin matches. A coin with only one known year is
 * treated as that single year. A coin with no mint year matches only when no
 * bound is given.
 *
 * Years are CE as plain numbers; BCE years are negative.
 */
export function overlapsYearRange(
  earliest: number | null | undefined,
  latest: number | null | undefined,
  start: number | null,
  end: number | null,
): boolean {
  if (start === null && end === null) return true

  const a = earliest ?? latest
  const b = latest ?? earliest
  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }

  if (start !== null && Math.max(a, b) < start) return false
  if (end !== null && Math.min(a, b) > end) return false
  return true
}
