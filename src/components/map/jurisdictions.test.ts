import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  changeYears,
  colourSlotOf,
  labelPointOf,
  REALM_COLOUR_SLOT,
  SLIDER_START,
  formatYear,
  joinList,
  resolveAtYear,
  SLIDER_END,
  type Corpus,
  type JurisdictionFeature,
  type JurisdictionProperties,
  type Tier,
} from "./jurisdictions"

/** A square somewhere harmless; the resolver never inspects coordinates. */
const SQUARE: GeoJSON.Geometry = {
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
  ],
}

function feature(
  props: Pick<JurisdictionProperties, "slug" | "segmentStart" | "segmentEnd"> &
    Partial<JurisdictionProperties>,
): JurisdictionFeature {
  return {
    type: "Feature",
    geometry: SQUARE,
    properties: {
      name: props.slug,
      tier: "realm" as Tier,
      kind: "realm",
      source: "src",
      basisYear: props.segmentStart,
      spanStart: props.segmentStart,
      spanEnd: props.segmentEnd,
      ...props,
    },
  }
}

const SOURCES = {
  src: { title: "Test Source", coverage: { from: -200, to: 1453 } },
  narrow: { title: "Narrow Source", coverage: { from: 100, to: 200 } },
}

function corpus(features: JurisdictionFeature[]): Corpus {
  return { features, sources: SOURCES }
}

describe("resolveAtYear", () => {
  it("draws nothing before anything exists", () => {
    const c = corpus([
      feature({ slug: "later", segmentStart: 100, segmentEnd: 200 }),
    ])
    const { jurisdictions, availableTiers } = resolveAtYear(c, 50)
    expect(jurisdictions).toHaveLength(0)
    expect(availableTiers).toEqual([])
  })

  it("draws a Jurisdiction inside its Span", () => {
    const c = corpus([
      feature({ slug: "here", segmentStart: 100, segmentEnd: 200 }),
    ])
    expect(resolveAtYear(c, 150).jurisdictions.map((j) => j.slug)).toEqual([
      "here",
    ])
  })

  it.each([
    ["first year", 100, true],
    ["last year", 200, true],
    ["year before", 99, false],
    ["year after", 201, false],
  ])("is inclusive at the %s", (_label, year, drawn) => {
    const c = corpus([
      feature({ slug: "here", segmentStart: 100, segmentEnd: 200 }),
    ])
    expect(resolveAtYear(c, year).jurisdictions).toHaveLength(drawn ? 1 : 0)
  })

  // A name change ends one Jurisdiction and begins its successors; the
  // predecessor must not linger alongside them.
  it("replaces a predecessor with its successors at a Succession", () => {
    const c = corpus([
      feature({ slug: "syria", segmentStart: 100, segmentEnd: 193 }),
      feature({ slug: "syria-coele", segmentStart: 194, segmentEnd: 400 }),
      feature({ slug: "syria-phoenice", segmentStart: 194, segmentEnd: 400 }),
    ])
    expect(resolveAtYear(c, 193).jurisdictions.map((j) => j.slug)).toEqual([
      "syria",
    ])
    expect(resolveAtYear(c, 194).jurisdictions.map((j) => j.slug)).toEqual([
      "syria-coele",
      "syria-phoenice",
    ])
  })

  // Gaps are real: carrying the last known shape forward would draw an empire
  // over territory a successor state actually held.
  it("does not carry a shape across a gap in its own segments", () => {
    const c = corpus([
      feature({
        slug: "east",
        segmentStart: 1206,
        segmentEnd: 1226,
        spanEnd: 1453,
      }),
      feature({
        slug: "east",
        segmentStart: 1279,
        segmentEnd: 1453,
        spanEnd: 1453,
      }),
    ])
    expect(resolveAtYear(c, 1250).jurisdictions).toHaveLength(0)
    expect(resolveAtYear(c, 1226).jurisdictions).toHaveLength(1)
    expect(resolveAtYear(c, 1279).jurisdictions).toHaveLength(1)
  })

  it("returns concurrent siblings rather than picking a winner", () => {
    const c = corpus([
      feature({ slug: "centre", segmentStart: 250, segmentEnd: 290 }),
      feature({ slug: "gallic", segmentStart: 260, segmentEnd: 274 }),
      feature({ slug: "palmyrene", segmentStart: 260, segmentEnd: 273 }),
    ])
    expect(resolveAtYear(c, 270).jurisdictions.map((j) => j.slug)).toEqual([
      "centre",
      "gallic",
      "palmyrene",
    ])
  })

  it("picks the more specific segment when two overlap", () => {
    const c = corpus([
      feature({ slug: "x", segmentStart: 100, segmentEnd: 300 }),
      feature({ slug: "x", segmentStart: 200, segmentEnd: 300 }),
    ])
    const [only] = resolveAtYear(c, 250).jurisdictions
    expect(only.feature.properties.segmentStart).toBe(200)
  })

  describe("Tiers", () => {
    const c = corpus([
      feature({ slug: "realm-a", segmentStart: 1, segmentEnd: 500 }),
      feature({
        slug: "prov-a",
        segmentStart: 1,
        segmentEnd: 200,
        tier: "province",
      }),
    ])

    it("reports only Tiers with content at the Selected year", () => {
      expect(resolveAtYear(c, 100).availableTiers).toEqual([
        "realm",
        "province",
      ])
      expect(resolveAtYear(c, 300).availableTiers).toEqual(["realm"])
    })

    it("narrows the drawn set to the requested Tier", () => {
      expect(
        resolveAtYear(c, 100, "province").jurisdictions.map((j) => j.slug),
      ).toEqual(["prov-a"])
    })

    it("returns nothing for a Tier with no content", () => {
      expect(resolveAtYear(c, 300, "province").jurisdictions).toHaveLength(0)
    })
  })

  describe("Attested and Inferred", () => {
    const c = corpus([
      feature({
        slug: "narrow",
        segmentStart: -200,
        segmentEnd: 1453,
        source: "narrow",
        name: "Narrowly Sourced",
      }),
    ])

    it("is Attested inside its Source's Coverage", () => {
      expect(resolveAtYear(c, 150).jurisdictions[0].attested).toBe(true)
      expect(resolveAtYear(c, 150).provenance.anyInferred).toBe(false)
    })

    it.each([99, 201])("is Inferred outside its Coverage (%s)", (year) => {
      expect(resolveAtYear(c, year).jurisdictions[0].attested).toBe(false)
      expect(resolveAtYear(c, year).provenance.anyInferred).toBe(true)
    })

    it("needs every Source it leans on to cover the year", () => {
      const mixed = corpus([
        feature({
          slug: "mixed",
          segmentStart: -200,
          segmentEnd: 1453,
          source: "src",
          spanSource: "narrow",
        }),
      ])
      expect(resolveAtYear(mixed, 150).jurisdictions[0].attested).toBe(true)
      expect(resolveAtYear(mixed, 900).jurisdictions[0].attested).toBe(false)
    })

    it("treats an undeclared Source as unable to vouch for anything", () => {
      const orphan = corpus([
        feature({
          slug: "orphan",
          segmentStart: 1,
          segmentEnd: 10,
          source: "?",
        }),
      ])
      expect(resolveAtYear(orphan, 5).jurisdictions[0].attested).toBe(false)
    })
  })

  describe("provenance sentence", () => {
    it("names the Sources actually in play", () => {
      const c = corpus([
        feature({ slug: "a", segmentStart: 100, segmentEnd: 200 }),
      ])
      expect(resolveAtYear(c, 150).provenance.sentence).toBe(
        "Boundaries after Test Source.",
      )
      expect(resolveAtYear(c, 150).provenance.sourceKeys).toEqual(["src"])
    })

    it("admits what is reconstructed", () => {
      const c = corpus([
        feature({
          slug: "n",
          name: "Narrow Land",
          segmentStart: -200,
          segmentEnd: 1453,
          source: "narrow",
        }),
      ])
      expect(resolveAtYear(c, 900).provenance.sentence).toBe(
        "Boundaries after Narrow Source. Reconstructed for this year, not attested: Narrow Land.",
      )
    })

    it("says so when nothing is mapped", () => {
      expect(resolveAtYear(corpus([]), 700).provenance.sentence).toBe(
        "Nothing mapped for AD 700.",
      )
    })
  })
})

describe("changeYears", () => {
  it("marks the year a segment begins and the year after it ends", () => {
    const c = corpus([
      feature({ slug: "a", segmentStart: 100, segmentEnd: 199 }),
      feature({ slug: "b", segmentStart: 200, segmentEnd: 299 }),
    ])
    expect(changeYears(c)).toEqual([100, 200, 300])
  })

  it("does not mark the window's own edges", () => {
    const c = corpus([
      feature({ slug: "all", segmentStart: -200, segmentEnd: SLIDER_END }),
    ])
    expect(changeYears(c)).toEqual([])
  })

  it("deduplicates years shared by several Jurisdictions", () => {
    const c = corpus([
      feature({ slug: "a", segmentStart: 395, segmentEnd: 475 }),
      feature({ slug: "b", segmentStart: 395, segmentEnd: 475 }),
    ])
    expect(changeYears(c)).toEqual([395, 476])
  })

  it("can be narrowed to one Tier", () => {
    const c = corpus([
      feature({ slug: "r", segmentStart: 100, segmentEnd: 199 }),
      feature({
        slug: "p",
        segmentStart: 500,
        segmentEnd: 599,
        tier: "province",
      }),
    ])
    expect(changeYears(c, "province")).toEqual([500, 600])
  })
})

describe("helpers", () => {
  it.each([
    [[], ""],
    [["a"], "a"],
    [["a", "b"], "a and b"],
    [["a", "b", "c"], "a, b and c"],
  ])("joins %s", (items, expected) => {
    expect(joinList(items)).toBe(expected)
  })

  it.each([
    [-200, "200 BC"],
    [-1, "1 BC"],
    [117, "AD 117"],
    [1453, "AD 1453"],
  ])("formats %s as %s", (year, expected) => {
    expect(formatYear(year)).toBe(expected)
  })
})

// Exercises the resolver against the data that actually ships, so the three
// fragmentation periods are proven on real geometry rather than fixtures.
describe("against the committed Realm Tier corpus", () => {
  const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
  const realCorpus: Corpus = {
    features: (
      JSON.parse(
        readFileSync(join(dataDir, "realms.geojson"), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[],
    sources: JSON.parse(
      readFileSync(join(dataDir, "sources.json"), "utf8"),
    ) as Record<string, never>,
  }

  const slugsAt = (year: number) =>
    resolveAtYear(realCorpus, year)
      .jurisdictions.map((j) => j.slug)
      .sort()

  it("shows the Republic at the slider's start", () => {
    expect(slugsAt(-200)).toEqual(["roman-republic"])
  })

  it("shows both empires after 395", () => {
    expect(slugsAt(400)).toEqual([
      "eastern-roman-empire",
      "western-roman-empire",
    ])
  })

  it("shows the breakaways alongside the centre in the 260s", () => {
    expect(slugsAt(265)).toEqual([
      "gallic-empire",
      "palmyrene-empire",
      "roman-empire",
    ])
  })

  it("shows the post-1204 fragmentation", () => {
    const slugs = slugsAt(1210)
    expect(slugs).toContain("latin-empire")
    expect(slugs).toContain("nicaean-empire")
    expect(slugs).toContain("empire-of-trebizond")
    expect(slugs).toContain("despotate-of-epirus")
  })

  it("does not invent a Succession at 633", () => {
    expect(slugsAt(632)).toContain("eastern-roman-empire")
    expect(slugsAt(633)).toContain("eastern-roman-empire")
    expect(slugsAt(633)).not.toContain("byzantine-empire")
  })

  it("still has something to draw at the final year", () => {
    expect(slugsAt(SLIDER_END).length).toBeGreaterThan(0)
  })

  it("treats everything as Attested, since Coverage spans the slider", () => {
    expect(resolveAtYear(realCorpus, 800).provenance.anyInferred).toBe(false)
  })
})

describe("realm identity colours", () => {
  it("assigns every Realm in the committed corpus a slot", () => {
    const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
    const features = (
      JSON.parse(
        readFileSync(join(dataDir, "realms.geojson"), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[]

    for (const slug of new Set(features.map((f) => f.properties.slug))) {
      expect(REALM_COLOUR_SLOT[slug]).toBeDefined()
    }
  })

  // Five tokens serve ten realms, which is only safe because realms sharing a
  // token never appear in the same year. That is an invariant of the data, not
  // of the palette, so the data is what has to prove it.
  it("never puts two Realms of the same colour on screen together", () => {
    const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
    const realCorpus: Corpus = {
      features: (
        JSON.parse(
          readFileSync(join(dataDir, "realms.geojson"), "utf8"),
        ) as GeoJSON.FeatureCollection
      ).features as JurisdictionFeature[],
      sources: JSON.parse(
        readFileSync(join(dataDir, "sources.json"), "utf8"),
      ) as Record<string, never>,
    }

    const clashes: string[] = []
    for (let year = SLIDER_START; year <= SLIDER_END; year++) {
      const drawn = resolveAtYear(realCorpus, year, "realm").jurisdictions
      const bySlot = new Map<number, string>()
      for (const j of drawn) {
        const slot = colourSlotOf(j.slug)
        const held = bySlot.get(slot)
        if (held && held !== j.slug) {
          clashes.push(
            `${formatYear(year)}: ${held} and ${j.slug} share slot ${slot}`,
          )
        }
        bySlot.set(slot, j.slug)
      }
    }

    expect(clashes.slice(0, 5)).toEqual([])
  })

  it("keeps the Roman mainline on one colour as it passes between entities", () => {
    expect(colourSlotOf("roman-republic")).toBe(colourSlotOf("roman-empire"))
    expect(colourSlotOf("roman-empire")).toBe(
      colourSlotOf("western-roman-empire"),
    )
  })

  it("falls back rather than throwing for an unknown slug", () => {
    expect(colourSlotOf("not-a-realm")).toBe(1)
  })
})

describe("labelPointOf", () => {
  it("returns the centroid of the largest ring, ignoring small islands", () => {
    const feature: JurisdictionFeature = {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // A big square around (10, 10).
          [
            [
              [0, 0],
              [20, 0],
              [20, 20],
              [0, 20],
              [0, 0],
            ],
          ],
          // A tiny island far away that must not drag the label off.
          [
            [
              [100, 100],
              [101, 100],
              [101, 101],
              [100, 101],
              [100, 100],
            ],
          ],
        ],
      },
      properties: {
        slug: "x",
        name: "X",
        tier: "realm",
        kind: "realm",
        source: "src",
        basisYear: 0,
        segmentStart: 0,
        segmentEnd: 1,
        spanStart: 0,
        spanEnd: 1,
      },
    }
    const point = labelPointOf(feature)
    expect(point?.[0]).toBeGreaterThan(5)
    expect(point?.[0]).toBeLessThan(15)
    expect(point?.[1]).toBeGreaterThan(5)
    expect(point?.[1]).toBeLessThan(15)
  })

  it("gives every drawn Realm somewhere to put its name", () => {
    const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
    const features = (
      JSON.parse(
        readFileSync(join(dataDir, "realms.geojson"), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[]

    expect(features.filter((f) => labelPointOf(f) === null)).toHaveLength(0)
  })
})
