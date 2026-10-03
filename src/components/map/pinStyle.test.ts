import { describe, expect, it } from "vitest"
import { pinStyle, type PinKind } from "./pinStyle"

const KINDS: PinKind[] = ["event", "minted", "found", "deity-place", "artifact"]

describe("pinStyle", () => {
  it("gives every kind a fill, a border and a popup colour", () => {
    for (const kind of KINDS) {
      const style = pinStyle(kind)
      expect(style.fillColor).toMatch(/^#[0-9a-f]{6}$/i)
      expect(style.borderColor).toMatch(/^#[0-9a-f]{6}$/i)
      expect(style.className).toMatch(/^text-/)
    }
  })

  it("tells the kinds apart by fill, so no two pins read the same", () => {
    const fills = KINDS.map((kind) => pinStyle(kind).fillColor)
    expect(new Set(fills).size).toBe(KINDS.length)
  })
})
