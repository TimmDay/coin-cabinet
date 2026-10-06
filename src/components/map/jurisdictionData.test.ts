import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { SLIDER_END, SLIDER_START } from "./jurisdictions"

// Guards the committed output of `pnpm data:jurisdictions` rather than the
// script itself: the script is run by hand and its product is what ships, so
// the product is what's worth asserting. See CONTEXT.md for Span, Basis year
// and Coverage.
const dataDir = join(process.cwd(), "public", "data", "jurisdictions")

const realms = JSON.parse(
  readFileSync(join(dataDir, "realms.geojson"), "utf8"),
) as GeoJSON.FeatureCollection

const sources = JSON.parse(
  readFileSync(join(dataDir, "sources.json"), "utf8"),
) as Record<string, Record<string, unknown>>

// Imported rather than restated: duplicating them meant this file silently
// disagreed with the pipeline when the window moved.

/** The Roman line. Everything else on the Realm Tier is an outsider. */
const EXPECTED_ROMAN_SLUGS = [
  "despotate-of-epirus",
  "eastern-roman-empire",
  "empire-of-trebizond",
  "gallic-empire",
  "latin-empire",
  "nicaean-empire",
  "palmyrene-empire",
  "roman-empire",
  "roman-republic",
  "western-roman-empire",
]

/** Clients and adversaries, which share the Tier but not the palette. */
const EXPECTED_OUTSIDER_SLUGS = [
  "antigonid-macedonia",
  "carthage",
  "kingdom-of-armenia",
  "kingdom-of-numidia",
  "kingdom-of-pontus",
  "nabataeans",
  "parthian-empire",
  "ptolemaic-kingdom",
  "sasanian-empire",
  "seleucid-empire",
]

const props = realms.features.map((f) => f.properties as Record<string, never>)

describe("realms.geojson", () => {
  it("is a non-empty FeatureCollection", () => {
    expect(realms.type).toBe("FeatureCollection")
    expect(realms.features.length).toBeGreaterThan(0)
  })

  it.each([
    "slug",
    "name",
    "tier",
    "kind",
    "source",
    "basisYear",
    "segmentStart",
    "segmentEnd",
    "spanStart",
    "spanEnd",
  ])("gives every feature a %s", (key) => {
    expect(props.filter((p) => p?.[key] === undefined)).toHaveLength(0)
  })

  it("gives every feature geometry", () => {
    const empty = realms.features.filter(
      (f) =>
        !f.geometry ||
        !("coordinates" in f.geometry) ||
        f.geometry.coordinates.length === 0,
    )
    expect(empty).toHaveLength(0)
  })

  it("holds only the expected Roman Jurisdictions", () => {
    const roman = props.filter((p) => (p.role ?? "roman") === "roman")
    expect([...new Set(roman.map((p) => p.slug))].sort()).toEqual(
      EXPECTED_ROMAN_SLUGS,
    )
  })

  it("holds only the expected clients and adversaries", () => {
    const outsiders = props.filter((p) => (p.role ?? "roman") !== "roman")
    expect([...new Set(outsiders.map((p) => p.slug))].sort()).toEqual(
      EXPECTED_OUTSIDER_SLUGS,
    )
  })

  it("gives every feature a Role it recognises", () => {
    const roles = new Set(props.map((p) => p.role ?? "roman"))
    expect([...roles].sort()).toEqual(["adversary", "client", "roman"])
  })

  it("clamps every segment to the slider window", () => {
    const outside = props.filter(
      (p) => p.segmentStart < SLIDER_START || p.segmentEnd > SLIDER_END,
    )
    expect(outside).toHaveLength(0)
  })

  it("never ends a segment before it starts", () => {
    expect(props.filter((p) => p.segmentStart > p.segmentEnd)).toHaveLength(0)
  })

  it("keeps every segment inside its Jurisdiction's Span", () => {
    const strays = props.filter(
      (p) => p.segmentStart < p.spanStart || p.segmentEnd > p.spanEnd,
    )
    expect(strays).toHaveLength(0)
  })

  it("dates geometry by the segment it came from", () => {
    expect(props.filter((p) => p.basisYear !== p.segmentStart)).toHaveLength(0)
  })

  // Cliopatria switches from "Eastern Roman Empire" to "Byzantine Empire" at
  // 633, which is a boundary in their segmentation rather than a historical
  // event. CONTEXT.md says a Jurisdiction is never renamed, so importing it
  // literally would invent a Succession and a Change year.
  it("treats the eastern empire as one Jurisdiction across 633", () => {
    expect(props.map((p) => p.slug)).not.toContain("byzantine-empire")

    const eastern = props.filter((p) => p.slug === "eastern-roman-empire")
    expect(eastern.length).toBeGreaterThan(0)
    expect(eastern[0].spanStart).toBe(395)
    expect(eastern[0].spanEnd).toBe(SLIDER_END)

    const years = eastern
      .map((p) => ({ start: p.segmentStart, end: p.segmentEnd }))
      .sort((a, b) => a.start - b.start)
    const spansAcross = years.some((s) => s.start <= 633 && s.end >= 633)
    const abutsAt633 = years.some((s) => s.start === 633)
    expect(spansAcross || abutsAt633).toBe(true)
  })

  it("agrees with its Source's Coverage", () => {
    const coverage = sources.cliopatria.coverage as { from: number; to: number }
    expect(
      Math.min(...props.map((p) => p.segmentStart)),
    ).toBeGreaterThanOrEqual(coverage.from)
    expect(Math.max(...props.map((p) => p.segmentEnd))).toBeLessThanOrEqual(
      coverage.to,
    )
  })
})

describe("sources.json", () => {
  it("describes every Source the layers reference", () => {
    for (const key of new Set(props.map((p) => p.source as string))) {
      expect(sources[key]).toBeDefined()
    }
  })

  it.each(["title", "modified", "coverage"])(
    "records %s for every Source",
    (key) => {
      for (const source of Object.values(sources)) {
        expect(source[key]).toBeTruthy()
      }
    },
  )

  // CC BY and CC BY-SA both require attribution and a statement that changes
  // were made; the pipeline filters, clamps and simplifies, so the notice is
  // not optional. A placeholder is not a bibliographic Source and is exempt.
  it.each(["url", "licence", "licenceUrl"])(
    "records %s for every citable Source",
    (key) => {
      for (const source of Object.values(sources)) {
        if (source.placeholder) continue
        expect(source[key]).toBeTruthy()
      }
    },
  )

  it("marks a placeholder as uncitable and gives it empty Coverage", () => {
    const placeholder = sources.placeholder
    expect(placeholder?.placeholder).toBe(true)
    const coverage = placeholder?.coverage as { from: number; to: number }
    // Empty by construction, so everything resting on it reports as Inferred.
    expect(coverage.from).toBeGreaterThan(coverage.to)
  })

  it("carries the date the output was built from its Sources", () => {
    for (const source of Object.values(sources)) {
      expect(source.retrieved).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    expect(sources.cliopatria?.upstreamCommit).not.toBe("unknown")
  })

  it("records known upstream defects rather than silently correcting them", () => {
    const defects = sources.cliopatria.defects as string[]
    expect(defects.length).toBeGreaterThan(0)
    expect(defects.join(" ")).toMatch(/Gallic/)
    expect(defects.join(" ")).toMatch(/Palmyrene/)
  })
})
