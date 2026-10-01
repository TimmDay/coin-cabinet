/**
 * True if a coin could have been minted in `year`: the year falls within the
 * coin's mint range, ends included. A coin with only one known year matches
 * that year alone. A coin with no mint year never matches.
 *
 * Years are CE as plain numbers; BCE years are negative.
 */
export function mintedInYear(
  earliest: number | null | undefined,
  latest: number | null | undefined,
  year: number,
): boolean {
  const a = earliest ?? latest
  const b = latest ?? earliest
  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }
  return Math.min(a, b) <= year && year <= Math.max(a, b)
}
