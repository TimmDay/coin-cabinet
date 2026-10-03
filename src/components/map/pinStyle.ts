// The one place that decides how a pin looks: old paper at sunset. A pin is
// named by its kind and callers spread the result into the marker, so a retint
// is an edit here and nothing else.

/** The colours behind every pin, cluster and pin label. */
export const PIN_PALETTE = {
  wine: "#6e2a3d",
  wineMid: "#5a2238",
  wineLight: "#8a3a4f",
  wineDark: "#2f1220",
  gold: "#e0a458",
  goldSoft: "#f0c27a",
  cream: "#fbeed3",
  creamWarm: "#f3dca8",
  orange: "#d9743a",
  orangeSoft: "#e08a45",
  sienna: "#b4492a",
  rose: "#b0486b",
  sage: "#5a7f55",
  dusk: "#5b3f66",
  umber: "#6a5a48",
  ink: "#2e1b12",
} as const

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

const P = PIN_PALETTE

const PIN_STYLES: Record<PinKind, PinStyle> = {
  event: {
    fillColor: P.wine,
    borderColor: P.goldSoft,
    className: "text-[#6e2a3d]",
  },
  minted: {
    fillColor: P.orange,
    borderColor: "#f6dfae",
    className: "text-[#a8431f]",
  },
  found: {
    fillColor: P.sage,
    borderColor: "#ead6a6",
    className: "text-[#3f5f3b]",
  },
  "deity-place": {
    fillColor: P.dusk,
    borderColor: P.gold,
    className: "text-[#5b3f66]",
  },
  artifact: {
    fillColor: P.umber,
    borderColor: "#d8c49a",
    className: "text-[#5a4a38]",
  },
}

export function pinStyle(kind: PinKind): PinStyle {
  return PIN_STYLES[kind]
}
