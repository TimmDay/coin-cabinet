import { describe, expect, it } from "vitest"
import { pinStyle, type PinKind } from "./pinStyle"

const KINDS: PinKind[] = ["event", "minted", "found", "deity-place", "artifact"]

describe("pinStyle", () => {
  it("gives every kind a fill, a border and a popup colour from the tokens", () => {
    for (const kind of KINDS) {
      const style = pinStyle(kind)
      expect(style.fillColor).toMatch(/^var\(--color-pin-[a-z-]+\)$/)
      expect(style.borderColor).toMatch(/^var\(--color-pin-[a-z-]+\)$/)
      expect(style.className).toMatch(/^text-pin-[a-z-]+$/)
    }
  })

  it("tells the kinds apart by fill, so no two pins read the same", () => {
    const fills = KINDS.map((kind) => pinStyle(kind).fillColor)
    expect(new Set(fills).size).toBe(KINDS.length)
  })
})
