/**
 * Years as the catalogue records them: negative for BC, positive for AD, and
 * no year zero, so 1 BC is followed by AD 1. Arithmetic across that line goes
 * through astronomical numbering, where 1 BC is 0 and 2 BC is -1, so that
 * subtracting two years gives the years between them.
 */

/** A catalogue year in astronomical numbering. */
export function toAstronomical(year: number): number {
  return year < 0 ? year + 1 : year
}

/** An astronomical year back as a catalogue year. */
export function fromAstronomical(year: number): number {
  return year <= 0 ? year - 1 : year
}

/** The year after `year`: AD 1 after 1 BC. */
export function nextYear(year: number): number {
  return fromAstronomical(toAstronomical(year) + 1)
}

/** How many years from `from` to `to`; one from 1 BC to AD 1. */
export function yearsBetween(from: number, to: number): number {
  return toAstronomical(to) - toAstronomical(from)
}
