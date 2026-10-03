// The map's colours live in `src/styles/globals.css` as `--color-map-*` and
// `--color-pin-*` tokens, written as #rrggbb. This file names them and reads
// them, so no colour is written anywhere else.

export const MAP_COLORS = [
  "map-land",
  "map-woods",
  "map-town",
  "map-ice",
  "map-water",
  "map-waterway",
  "map-water-label",
  "map-water-label-halo",
  "map-border",
  "map-ink",
  "map-province-fill",
  "map-province-line",
  "map-bc60-fill",
  "map-bc60-line",
  "map-ad14-fill",
  "map-ad14-line",
  "map-ad69-fill",
  "map-ad69-line",
  "map-ad117-fill",
  "map-ad117-line",
  "map-ad200-fill",
  "map-ad200-line",
  "pin-wine",
  "pin-wine-mid",
  "pin-wine-light",
  "pin-wine-dark",
  "pin-gold",
  "pin-gold-soft",
  "pin-cream",
  "pin-cream-warm",
  "pin-orange",
  "pin-orange-soft",
  "pin-sienna",
  "pin-rose",
  "pin-sage",
  "pin-sage-dark",
  "pin-dusk",
  "pin-umber",
  "pin-umber-dark",
  "pin-minted-edge",
  "pin-found-edge",
  "pin-artifact-edge",
] as const

export type MapColor = (typeof MAP_COLORS)[number]

/**
 * The colour as a CSS reference, for HTML, SVG attributes and inline styles.
 * Anything the browser styles can use it; MapLibre cannot (use `glColor`).
 */
export const cssColor = (name: MapColor) => `var(--color-${name})`

/**
 * The colour's resolved #rrggbb value, for MapLibre paint properties, which
 * parse colour strings themselves and cannot read `var()`. Browser only.
 */
export function glColor(name: MapColor): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim()
  if (!value) throw new Error(`Map colour --color-${name} is not defined`)
  return value
}
