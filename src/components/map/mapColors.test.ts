import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { MAP_COLORS } from "./mapColors"

const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8")

function declared(name: string) {
  return new RegExp(`--color-${name}:\\s*([^;]+);`).exec(css)?.[1]?.trim()
}

describe("map colour tokens", () => {
  it("defines every named colour as #rrggbb, the form MapLibre parses", () => {
    for (const name of MAP_COLORS) {
      expect(declared(name), `--color-${name}`).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it("names every map and pin token in globals.css", () => {
    const inCss = [...css.matchAll(/--color-((?:map|pin)-[a-z0-9-]+):/g)]
      .map((match) => match[1]!)
      // map-label is an alias of a pin colour, for Tailwind utilities
      .filter((name) => name !== "map-label")

    expect([...inCss].sort()).toEqual([...MAP_COLORS].sort())
  })
})
