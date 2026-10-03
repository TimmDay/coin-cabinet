// The one place that decides how a pin looks: old paper at sunset. A pin is
// named by its kind and callers spread the result into the marker, so a retint
// is an edit to the tokens in globals.css and nothing else.

import { cssColor } from "./mapColors"

export type PinKind =
  | "event" // a timeline event
  | "minted" // where this coin was struck
  | "found" // where this coin was found
  | "deity-place" // a place tied to a deity on the coin
  | "artifact" // where a related artifact is kept

export type PinStyle = {
  fillColor: string
  borderColor: string
  /** Colour of the popup title, as a Tailwind class. */
  className: string
}

const PIN_STYLES: Record<PinKind, PinStyle> = {
  event: {
    fillColor: cssColor("pin-wine"),
    borderColor: cssColor("pin-gold-soft"),
    className: "text-pin-wine",
  },
  minted: {
    fillColor: cssColor("pin-orange"),
    borderColor: cssColor("pin-minted-edge"),
    className: "text-pin-sienna",
  },
  found: {
    fillColor: cssColor("pin-sage"),
    borderColor: cssColor("pin-found-edge"),
    className: "text-pin-sage-dark",
  },
  "deity-place": {
    fillColor: cssColor("pin-dusk"),
    borderColor: cssColor("pin-gold"),
    className: "text-pin-dusk",
  },
  artifact: {
    fillColor: cssColor("pin-umber"),
    borderColor: cssColor("pin-artifact-edge"),
    className: "text-pin-umber-dark",
  },
}

export function pinStyle(kind: PinKind): PinStyle {
  return PIN_STYLES[kind]
}
