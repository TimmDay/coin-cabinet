/**
 * Years as the catalogue records them: negative for BCE, positive for CE, and
 * no year zero, so 1 BCE is followed by 1 CE. Arithmetic across that line goes
 * through astronomical numbering, where 1 BCE is 0 and 2 BCE is -1, so that
 * subtracting two years gives the years between them. Shown to readers as
 * "336 BCE" and "27 CE".
 */

/** A catalogue year in astronomical numbering. */
export function toAstronomical(year: number): number {
  return year < 0 ? year + 1 : year
}

/** An astronomical year back as a catalogue year. */
export function fromAstronomical(year: number): number {
  return year <= 0 ? year - 1 : year
}

/** The year after `year`: 1 CE after 1 BCE. */
export function nextYear(year: number): number {
  return fromAstronomical(toAstronomical(year) + 1)
}

/** How many years from `from` to `to`; one from 1 BCE to 1 CE. */
export function yearsBetween(from: number, to: number): number {
  return toAstronomical(to) - toAstronomical(from)
}

/** True for a year the catalogue records; 0, null and undefined are no year. */
export function isYear(year: number | null | undefined): year is number {
  return year !== null && year !== undefined && year !== 0
}

/** "336 BCE" or "27 CE". */
export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`
}

/**
 * A year for a timeline marker, where the space is tight: "336 BCE", but CE
 * years go bare ("27"), since markers crowd together in CE and spread out in
 * BCE.
 */
export function formatTimelineYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year}`
}

/**
 * "27—14 BCE", "27 BCE—14 CE", or one year when both ends agree. A missing
 * end (0, null or undefined) leaves the other end on its own, and "" means
 * neither is known.
 */
export function formatYearRange(
  earliest: number | null | undefined,
  latest: number | null | undefined,
): string {
  const from = isYear(earliest) ? earliest : null
  const to = isYear(latest) ? latest : null
  if (from === null && to === null) return ""
  if (from === null || to === null || from === to) {
    return formatYear((from ?? to)!)
  }
  if (from < 0 === to < 0) {
    return `${Math.abs(from)}—${formatYear(to)}`
  }
  return `${formatYear(from)}—${formatYear(to)}`
}

/**
 * A run of years that may be open at one end, such as a reign or a mint's
 * working life: "270—275 CE", "from 260 BCE" or "until 14 CE", and "" when
 * neither end is known. Unlike `formatYearRange`, one known end is never shown
 * as if it were a single year.
 */
export function formatOpenYearRange(
  earliest: number | null | undefined,
  latest: number | null | undefined,
): string {
  if (isYear(earliest) && !isYear(latest)) return `from ${formatYear(earliest)}`
  if (!isYear(earliest) && isYear(latest)) return `until ${formatYear(latest)}`
  return formatYearRange(earliest, latest)
}
