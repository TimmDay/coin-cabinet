import { describe, expect, it } from "vitest"
import type {
  Corpus,
  JurisdictionFeature,
  JurisdictionProperties,
} from "./jurisdictions"
import { mapAtYear } from "./mapAtYear"

function square(x: number): GeoJSON.Geometry {
  return {
    type: "Polygon",
    coordinates: [
      [
        [x, 0],
        [x + 1, 0],
        [x + 1, 1],
        [x, 1],
        [x, 0],
      ],
    ],
  }
}

function feature(
  slug: string,
  props: Partial<JurisdictionProperties> = {},
  x = 0,
): JurisdictionFeature {
  return {
    type: "Feature",
    geometry: square(x),
    properties: {
      slug,
      name: slug,
      tier: "realm",
      kind: "realm",
      source: "src",
      basisYear: 100,
      segmentStart: 100,
      segmentEnd: 200,
      spanStart: 100,
      spanEnd: 200,
      ...props,
    },
  }
}

const corpus = (...features: JurisdictionFeature[]): Corpus => ({
  features,
  sources: {
    src: { title: "Test Source", coverage: { from: -200, to: 1453 } },
    guess: { title: "Guess", coverage: { from: 0, to: 0 }, placeholder: true },
  },
})

const names = (view: ReturnType<typeof mapAtYear>) =>
  view.features?.features.map((f) => f.properties?.name)

describe("mapAtYear", () => {
  const rome = feature("Rome")
  const parthia = feature("Parthia", { role: "adversary" }, 5)
  const syria = feature("Syria", { tier: "province", kind: "province" }, 2)
  const asia = feature("Asia", { tier: "province", kind: "province" }, 3)

  it("draws the Tier asked for at the Selected year", () => {
    const view = mapAtYear(corpus(rome, syria), { year: 150, tier: "province" })
    expect(view.tier).toBe("province")
    expect(names(view)).toEqual(["Syria"])
    expect(view.availableTiers).toEqual(["realm", "province"])
  })

  it("falls back to a Tier with data when asked to", () => {
    const view = mapAtYear(corpus(rome), {
      year: 150,
      tier: "province",
      fallback: true,
    })
    expect(view.tier).toBe("realm")
    expect(names(view)).toEqual(["Rome"])
  })

  it("leaves an empty Tier empty when not asked to fall back", () => {
    const view = mapAtYear(corpus(rome), { year: 150, tier: "province" })
    expect(view.tier).toBe("province")
    expect(view.features).toBeNull()
    expect(view.bounds).toBeNull()
  })

  it("draws only Roman Jurisdictions unless outsider Roles are asked for", () => {
    const c = corpus(rome, parthia)
    expect(names(mapAtYear(c, { year: 150, tier: "realm" }))).toEqual(["Rome"])
    expect(
      names(
        mapAtYear(c, {
          year: 150,
          tier: "realm",
          outsiderRoles: ["adversary"],
        }),
      ),
    ).toEqual(["Parthia", "Rome"])
  })

  it("narrows provinces to a selection, leaving realms alone", () => {
    const view = mapAtYear(corpus(rome, syria, asia), {
      year: 150,
      selectedProvinces: ["Asia"],
    })
    expect(names(view)).toEqual(["Asia", "Rome"])
  })

  it("marks a Jurisdiction with assumed dates in its label", () => {
    const view = mapAtYear(
      corpus(feature("Guessed", { spanSource: "guess" })),
      {
        year: 150,
      },
    )
    expect(view.labels.map((l) => l.name)).toEqual(["Guessed*"])
  })

  it("carries whether each Jurisdiction is Attested onto its feature", () => {
    const view = mapAtYear(
      corpus(feature("Guessed", { spanSource: "guess" })),
      {
        year: 150,
      },
    )
    expect(view.features?.features[0]?.properties?.attested).toBe(false)
  })

  it("bounds the Jurisdictions of the Tier", () => {
    const view = mapAtYear(corpus(rome, syria), { year: 150 })
    expect(view.bounds).toEqual([0, 0, 3, 1])
  })
})
