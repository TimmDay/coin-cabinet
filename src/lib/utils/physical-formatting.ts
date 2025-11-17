/**
 * Options for formatting physical characteristics
 */
export type PhysicalCharacteristicsOptions = {
  /** Format style: 'detailed' shows labels, 'compact' shows values only */
  style?: "detailed" | "compact"
  /** Separator for compact style (default: ' | ') */
  separator?: string
  /** Separator for detailed style (default: '\n') */
  detailedSeparator?: string
}

/**
 * Format physical characteristics of a coin
 * @param characteristics - Object containing diameter, mass, and dieAxis
 * @param options - Formatting options
 * @returns Formatted string or null if no characteristics provided
 *
 * @example
 * // Detailed format (for cards, forms, etc.)
 * formatPhysicalCharacteristics({ diameter: 20, mass: 3.5, dieAxis: '6h' })
 * // Returns: "Diameter: 20mm\nMass: 3.5g\nDie Axis: 6h"
 *
 * // Compact format (for snapshots, lists, etc.)
 * formatPhysicalCharacteristics(
 *   { diameter: 20, mass: 3.5, dieAxis: '6h' },
 *   { style: 'compact' }
 * )
 * // Returns: "20mm | 3.5g | 6h"
 */
export function formatPhysicalCharacteristics(
  characteristics: {
    diameter?: number | null
    mass?: number | null
    dieAxis?: string | null
  },
  options: PhysicalCharacteristicsOptions = {},
): string | null {
  const {
    style = "detailed",
    separator = " | ",
    detailedSeparator = "\n",
  } = options

  const { diameter, mass, dieAxis } = characteristics

  if (style === "compact") {
    // Compact format: "20mm | 3.5g | 6h"
    const parts = [
      diameter ? `${diameter}mm` : null,
      mass ? `${mass}g` : null,
      dieAxis,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(separator) : null
  } else {
    // Detailed format: "Diameter: 20mm\nMass: 3.5g\nDie Axis: 6h"
    const parts = [
      diameter ? `Diameter: ${diameter}mm` : null,
      mass ? `Mass: ${mass}g` : null,
      dieAxis ? `Die Axis: ${dieAxis}` : null,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(detailedSeparator) : null
  }
}

/**
 * Format physical characteristics in compact style (shorthand)
 * @param characteristics - Object containing diameter, mass, and dieAxis
 * @param separator - Custom separator (default: ' | ')
 * @returns Formatted string or null if no characteristics provided
 */
export function formatPhysicalCharacteristicsCompact(
  characteristics: {
    diameter?: number | null
    mass?: number | null
    dieAxis?: string | null
  },
  separator = " | ",
): string | null {
  return formatPhysicalCharacteristics(characteristics, {
    style: "compact",
    separator,
  })
}
