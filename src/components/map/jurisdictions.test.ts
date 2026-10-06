import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  changeYears,
  COIN_PAGE_TIER,
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
      feature({
        slug: "all",
        segmentStart: SLIDER_START,
        segmentEnd: SLIDER_END,
      }),
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

  /** The Roman line only; clients and adversaries share this Tier now. */
  const slugsAt = (year: number) =>
    resolveAtYear(realCorpus, year)
      .jurisdictions.filter((j) => j.role === "roman")
      .map((j) => j.slug)
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

describe("assumed dates", () => {
  const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
  const read = (file: string) =>
    (
      JSON.parse(
        readFileSync(join(dataDir, file), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[]

  const full: Corpus = {
    features: [...read("realms.geojson"), ...read("provinces.geojson")],
    sources: JSON.parse(
      readFileSync(join(dataDir, "sources.json"), "utf8"),
    ) as Record<string, never>,
  }

  const countAt = (year: number) =>
    resolveAtYear(full, year, "province").jurisdictions.length

  it("flags a Jurisdiction whose Span rests on a placeholder", () => {
    const drawn = resolveAtYear(full, 200, "province").jurisdictions
    const assumed = drawn.filter((j) => j.datesAssumed)
    expect(assumed.length).toBeGreaterThan(0)
    // Attested ones must not be swept up in it.
    expect(drawn.find((j) => j.name === "Dacia")?.datesAssumed).toBe(false)
  })

  it("does not confuse assumed dates with unattested geometry", () => {
    // Every province outline is an AD 117 snapshot, so at 200 nothing is
    // Attested, yet only some have assumed dates.
    const drawn = resolveAtYear(full, 200, "province").jurisdictions
    expect(drawn.every((j) => !j.attested)).toBe(true)
    expect(drawn.some((j) => !j.datesAssumed)).toBe(true)
  })

  // The placeholder used to be the Principate, so sixteen Jurisdictions began
  // and ended on the same day and a reader scrubbing the slider saw it as an
  // event: Augustus's settlement at one end, collapse under Diocletian at the
  // other. Neither happened.
  it.each([
    ["Augustus's supposed settlement", -28, -27],
    ["the supposed collapse under Diocletian", 284, 285],
  ])("has no cliff at %s", (_label, before, after) => {
    expect(Math.abs(countAt(after) - countAt(before))).toBeLessThan(5)
  })

  // The regiones really did end with Diocletian's reorganisation.
  it("still shows the real change at 293", () => {
    expect(countAt(292) - countAt(293)).toBe(11)
  })
})

describe("realm identity colours", () => {
  it("assigns every Roman Realm in the committed corpus a slot", () => {
    const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
    const features = (
      JSON.parse(
        readFileSync(join(dataDir, "realms.geojson"), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[]

    const roman = features.filter(
      (f) => (f.properties.role ?? "roman") === "roman",
    )
    for (const slug of new Set(roman.map((f) => f.properties.slug))) {
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
      const drawn = resolveAtYear(
        realCorpus,
        year,
        "realm",
      ).jurisdictions.filter((j) => j.role === "roman")
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

describe("against the committed Province Tier corpus", () => {
  const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
  const read = (file: string) =>
    (
      JSON.parse(
        readFileSync(join(dataDir, file), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[]

  const full: Corpus = {
    features: [...read("realms.geojson"), ...read("provinces.geojson")],
    sources: JSON.parse(
      readFileSync(join(dataDir, "sources.json"), "utf8"),
    ) as Record<string, never>,
  }

  // The slider opens before the First Punic War, when Rome held no provinces
  // at all. Anything drawn then beyond Italy is there because its dates are
  // assumed rather than sourced, and it says so: this is the cost of giving
  // the placeholders a wide Span, and it is paid in the open.
  it("marks everything it cannot date at the slider's first year", () => {
    const drawn = resolveAtYear(full, SLIDER_START, "province").jurisdictions
    const names = drawn.map((j) => j.name)
    expect(names).toContain("Italia")

    for (const jurisdiction of drawn) {
      if (jurisdiction.name === "Italia") continue
      expect(jurisdiction.datesAssumed).toBe(true)
    }
  })

  // Sicilia, taken from Carthage in 241 BC, was the first province Rome had.
  it("gains Sicilia in 241 BC and not before", () => {
    const has = (year: number) =>
      resolveAtYear(full, year, "province").jurisdictions.some(
        (j) => j.name === "Sicilia",
      )
    expect(has(-242)).toBe(false)
    expect(has(-241)).toBe(true)
  })

  it("adds Hispania Citerior once its Span opens in 197 BC", () => {
    const has = (year: number) =>
      resolveAtYear(full, year, "province").jurisdictions.some(
        (j) => j.name === "Hispania Citerior",
      )
    expect(has(-198)).toBe(false)
    expect(has(-196)).toBe(true)
  })

  // The bug this feature exists to fix.
  it("does not draw Dacia or Arabia around a Republican coin", () => {
    const names = resolveAtYear(full, -100, "province").jurisdictions.map(
      (j) => j.name,
    )
    expect(names).not.toContain("Dacia")
    expect(names).not.toContain("Arabia")
    expect(names).not.toContain("Germania Inferior")
  })

  it("draws Dacia only across its attested Span", () => {
    const has = (year: number) =>
      resolveAtYear(full, year, "province").jurisdictions.some(
        (j) => j.name === "Dacia",
      )
    expect(has(105)).toBe(false)
    expect(has(150)).toBe(true)
    expect(has(300)).toBe(false)
  })

  it("replaces Iudaea with Syria Palaestina at the rename", () => {
    const namesAt = (year: number) =>
      resolveAtYear(full, year, "province").jurisdictions.map((j) => j.name)
    expect(namesAt(100)).toContain("Iudaea")
    expect(namesAt(100)).not.toContain("Syria Palaestina")
    expect(namesAt(200)).toContain("Syria Palaestina")
    expect(namesAt(200)).not.toContain("Iudaea")
  })

  it("reports geometry as Inferred outside the snapshot's Basis window", () => {
    // Every province shape is an AD 117-ish snapshot, so a Republican view is
    // a reconstruction however well attested the Span is.
    const republican = resolveAtYear(full, -100, "province")
    expect(republican.jurisdictions.length).toBeGreaterThan(0)
    expect(republican.jurisdictions.every((j) => !j.attested)).toBe(true)
    expect(republican.provenance.anyInferred).toBe(true)
    expect(republican.provenance.sentence).toMatch(
      /Reconstructed for this year/,
    )
  })

  it("names the Province Tier's Sources", () => {
    const { provenance } = resolveAtYear(full, 117, "province")
    expect(provenance.sourceKeys).toContain("pazout")
    expect(provenance.sentence).toMatch(/Boundaries after/)
  })

  it("leaves the Province Tier unavailable deep into the Byzantine range", () => {
    const { availableTiers } = resolveAtYear(full, 900)
    expect(availableTiers).toContain("realm")
    expect(availableTiers).not.toContain("province")
  })

  it("keeps Roma on the City Tier", () => {
    const city = resolveAtYear(full, 117, "city").jurisdictions
    expect(city.map((j) => j.name)).toEqual(["Roma"])
  })

  it("marks the regiones as belonging to no Tier of their own", () => {
    const regiones = full.features.filter((f) => f.properties.kind === "regio")
    expect(regiones).toHaveLength(11)
    expect(regiones.every((f) => f.properties.tier === "province")).toBe(true)
  })

  it("rests nothing on a placeholder Span without reporting it as Inferred", () => {
    const placeheld = full.features.filter(
      (f) => f.properties.spanSource === "placeholder",
    )
    expect(placeheld.length).toBeGreaterThan(0)
    for (const feature of placeheld) {
      const year = feature.properties.spanStart + 1
      const drawn = resolveAtYear(
        full,
        year,
        feature.properties.tier,
      ).jurisdictions.find((j) => j.slug === feature.properties.slug)
      expect(drawn?.attested).toBe(false)
    }
  })
})

describe("the Tier a coin's map opens at", () => {
  const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
  const read = (file: string) =>
    (
      JSON.parse(
        readFileSync(join(dataDir, file), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[]

  const full: Corpus = {
    features: [...read("realms.geojson"), ...read("provinces.geojson")],
    sources: JSON.parse(
      readFileSync(join(dataDir, "sources.json"), "utf8"),
    ) as Record<string, never>,
  }

  // Every drawn Jurisdiction carries a label, so the count is the crowding.
  // Roman only: a coin page shows no clients or adversaries unless asked, so
  // counting them here would measure something the page never draws.
  const drawnAt = (year: number, tier: Tier) =>
    resolveAtYear(full, year, tier).jurisdictions.filter(
      (j) => j.role === "roman",
    ).length

  it.each([
    ["a Severan denarius", 200],
    ["a Trajanic sestertius", 117],
    ["a Julio-Claudian as", 50],
  ])("stays uncluttered beside %s", (_label, year) => {
    expect(drawnAt(year, COIN_PAGE_TIER)).toBeLessThanOrEqual(3)
  })

  // The reason for the default, stated as a fact about the data rather than
  // as an opinion: the Province Tier is an order of magnitude busier, and a
  // coin's own pins have to stay findable among those outlines.
  it("is far less crowded than the Province Tier at the same year", () => {
    expect(drawnAt(117, "province")).toBeGreaterThan(
      drawnAt(117, COIN_PAGE_TIER) * 10,
    )
  })

  it("still has something to show across the whole slider", () => {
    for (const year of [SLIDER_START, -50, 117, 400, 800, 1200, 1453]) {
      expect(drawnAt(year, COIN_PAGE_TIER)).toBeGreaterThan(0)
    }
  })
})

describe("clients and adversaries", () => {
  const dataDir = join(process.cwd(), "public", "data", "jurisdictions")
  const corpusOf = (): Corpus => ({
    features: (
      JSON.parse(
        readFileSync(join(dataDir, "realms.geojson"), "utf8"),
      ) as GeoJSON.FeatureCollection
    ).features as JurisdictionFeature[],
    sources: JSON.parse(
      readFileSync(join(dataDir, "sources.json"), "utf8"),
    ) as Record<string, never>,
  })
  const c = corpusOf()

  const at = (year: number) =>
    resolveAtYear(c, year, "realm").jurisdictions.filter(
      (j) => j.role !== "roman",
    )

  it("puts the Republic among rivals rather than in empty space", () => {
    // The point of the feature: 200 BC was not Rome alone.
    const names = at(-200).map((j) => j.name)
    expect(names).toContain("Carthage")
    expect(names).toContain("Seleucid Empire")
    expect(names).toContain("Ptolemaic Kingdom")
    expect(names.length).toBeGreaterThanOrEqual(5)
  })

  it("retires Carthage after its destruction", () => {
    expect(at(-150).map((j) => j.name)).toContain("Carthage")
    expect(at(-140).map((j) => j.name)).not.toContain("Carthage")
  })

  it("hands the east from Parthia to the Sasanians", () => {
    expect(at(150).map((j) => j.name)).toContain("Parthian Empire")
    expect(at(400).map((j) => j.name)).toContain("Sasanian Empire")
    expect(at(400).map((j) => j.name)).not.toContain("Parthian Empire")
  })

  it("leaves the high empire uncluttered, as the data says", () => {
    // AD 117 really is quiet: Parthia, and Rome's clients largely absorbed.
    expect(at(117).length).toBeLessThanOrEqual(3)
  })

  it("distinguishes clients from adversaries", () => {
    const roles = new Map(
      c.features.map((f) => [f.properties.slug, f.properties.role]),
    )
    expect(roles.get("kingdom-of-armenia")).toBe("client")
    expect(roles.get("nabataeans")).toBe("client")
    expect(roles.get("carthage")).toBe("adversary")
    expect(roles.get("sasanian-empire")).toBe("adversary")
  })

  // The whole reason these share one treatment: eight concurrent hues will
  // not pass colour-blind separation, so the five validated slots stay with
  // the Roman line and outsiders are deliberately absent from the palette.
  it("keeps outsiders out of the identity palette", () => {
    for (const f of c.features) {
      if ((f.properties.role ?? "roman") === "roman") continue
      expect(REALM_COLOUR_SLOT[f.properties.slug]).toBeUndefined()
    }
  })

  it("never draws more concurrent Roman realms than the palette has slots", () => {
    let worst = 0
    for (let year = SLIDER_START; year <= SLIDER_END; year++) {
      const roman = resolveAtYear(c, year, "realm").jurisdictions.filter(
        (j) => j.role === "roman",
      )
      worst = Math.max(worst, roman.length)
    }
    expect(worst).toBeLessThanOrEqual(5)
  })

  it("omits polities whose whole span predates the slider", () => {
    // Both end before 275 BC, so they clamp away to nothing.
    const slugs = new Set(c.features.map((f) => f.properties.slug))
    expect(slugs).not.toContain("achaemenid-empire")
    expect(slugs).not.toContain("macedonian-empire")
  })
})
