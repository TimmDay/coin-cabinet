/**
 * Format a year range with proper BCE/CE handling
 * @param earliest - The earliest year (negative for BCE)
 * @param latest - The latest year (negative for BCE)
 * @returns Formatted year range string, e.g., "(27—14 BCE)" or "(336—323 BCE)" or "(27 BCE—14 CE)"
 */
export function formatYearRange(
  earliest?: number | null,
  latest?: number | null,
): string {
  if (!earliest || !latest) return ""

  // If start and end dates are the same, show single year
  if (earliest === latest) {
    if (earliest > 0) {
      return `(${earliest} CE)`
    } else {
      return `(${Math.abs(earliest)} BCE)`
    }
  }

  if (earliest > 0 && latest > 0) {
    // Both positive - use CE
    return `(${earliest}—${latest} CE)`
  } else if (earliest < 0 && latest < 0) {
    // Both negative - use BCE, strip negative signs, keep chronological order
    return `(${Math.abs(earliest)}—${Math.abs(latest)} BCE)`
  } else if (earliest < 0 && latest > 0) {
    // Crosses BCE/CE boundary
    return `(${Math.abs(earliest)} BCE—${latest} CE)`
  }

  return ""
}

/**
 * Format a single year with proper BCE/CE handling
 * @param year - The year (negative for BCE, positive for CE)
 * @returns Formatted year string, e.g., "27 CE" or "336 BCE"
 */
export function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`
  } else {
    return `${year} CE`
  }
}

/**
 * Format a single year for timeline markers (no CE suffix for positive years).
 * This saves space for clumped years. BCE ones are generally spread out enough to not matter.
 * @param year - The year (negative for BCE, positive for CE)
 * @returns Formatted year string, e.g., "27" or "336 BCE"
 */
export function formatTimelineYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`
  } else {
    return `${year}`
  }
}

/**
 * Format a Roman date range for display (without parentheses)
 * @param startYear - Start year (negative for BCE, positive for CE)
 * @param endYear - End year (negative for BCE, positive for CE)
 * @returns Formatted date range string
 */
export function formatRomanDateRange(
  startYear: number,
  endYear: number,
): string {
  if (startYear === endYear) {
    return formatYear(startYear)
  }

  return `${formatYear(startYear)} - ${formatYear(endYear)}`
}
