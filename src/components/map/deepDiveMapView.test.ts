import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import {
  ADMIN_LABEL_ZOOM,
  FIRST_ADMIN_AREAS_YEAR,
  deepDiveMapViewFor,
} from "./deepDiveMapView"
import { COIN_PAGE_TIER, TIERS } from "./jurisdictions"
import { DEEP_DIVE_MAP_VIEW, OVERLAY_FADE_ZOOM } from "./mapConfig"

const DEFAULT = {
  center: DEEP_DIVE_MAP_VIEW.center,
  zoom: DEEP_DIVE_MAP_VIEW.zoom,
  tier: COIN_PAGE_TIER,
}

// Rough boxes, [lat, lng] ranges, to prove each centre is the right place
const near = (
  [lat, lng]: [number, number],
  place: { lat: [number, number]; lng: [number, number] },
) =>
  lat >= place.lat[0] &&
  lat <= place.lat[1] &&
  lng >= place.lng[0] &&
  lng <= place.lng[1]

describe("deepDiveMapViewFor", () => {
  it("leaves anything Roman exactly as the default", () => {
    for (const culture of [
      "Roman Imperial",
      "Roman Provincial",
      "Roman Republic",
      "roman",
      "Late ROMAN period",
    ]) {
      expect(deepDiveMapViewFor(culture), culture).toEqual(DEFAULT)
    }
  })

  it("gives an unknown or missing culture the default", () => {
    for (const culture of ["Syria", "", "   ", null, undefined]) {
      expect(deepDiveMapViewFor(culture)).toEqual(DEFAULT)
    }
  })

  it("opens a Judea coin on Jerusalem, on Admin areas, as close as the labels allow", () => {
    const view = deepDiveMapViewFor("Judea")
    expect(near(view.center, { lat: [31.7, 31.9], lng: [35.1, 35.3] })).toBe(
      true,
    )
    expect(view.tier).toBe("province")
    expect(view.zoom).toBe(ADMIN_LABEL_ZOOM)
    expect(deepDiveMapViewFor("Judaea")).toEqual(view)
  })

  it("opens a Carthage coin on Carthage, on Admin areas, as close as the labels allow", () => {
    const view = deepDiveMapViewFor("Carthage")
    expect(near(view.center, { lat: [36.7, 37], lng: [10.2, 10.5] })).toBe(true)
    expect(view.tier).toBe("province")
    expect(view.zoom).toBe(ADMIN_LABEL_ZOOM)
    expect(deepDiveMapViewFor("Carthaginian")).toEqual(view)
  })

  it("keeps the admin-area zoom below where the overlay and its names disappear", () => {
    expect(ADMIN_LABEL_ZOOM).toBeLessThan(OVERLAY_FADE_ZOOM.to)
    expect(ADMIN_LABEL_ZOOM).toBeGreaterThan(OVERLAY_FADE_ZOOM.from)
  })

  it("centres Byzantine coins on Constantinople and changes nothing else", () => {
    const view = deepDiveMapViewFor("Byzantine")
    expect(near(view.center, { lat: [40.9, 41.2], lng: [28.8, 29.1] })).toBe(
      true,
    )
    expect({ zoom: view.zoom, tier: view.tier }).toEqual({
      zoom: DEFAULT.zoom,
      tier: DEFAULT.tier,
    })
  })

  it("centres Persian, Parthian and Sassanian coins on Ctesiphon, at the default zoom, on Realms", () => {
    for (const culture of [
      "Persian",
      "Parthia",
      "Parthian",
      "Sassanian",
      "Sassanid",
    ]) {
      const view = deepDiveMapViewFor(culture)
      expect(
        near(view.center, { lat: [33, 33.3], lng: [44.4, 44.8] }),
        culture,
      ).toBe(true)
      expect(view.zoom, culture).toBe(DEFAULT.zoom)
      expect(view.tier, culture).toBe("realm")
    }
  })

  it("centres Ancient Greece on Athens and changes nothing else", () => {
    const view = deepDiveMapViewFor("Ancient Greece")
    expect(near(view.center, { lat: [37.9, 38.1], lng: [23.6, 23.9] })).toBe(
      true,
    )
    expect({ zoom: view.zoom, tier: view.tier }).toEqual({
      zoom: DEFAULT.zoom,
      tier: DEFAULT.tier,
    })
  })

  it("centres the Gallic Empire on London, a bit closer than the default, on Realms", () => {
    const view = deepDiveMapViewFor("Gallic Empire")
    expect(near(view.center, { lat: [51.4, 51.6], lng: [-0.3, 0] })).toBe(true)
    expect(view.zoom).toBeGreaterThan(DEFAULT.zoom)
    // The empire is about 13 degrees tall, which stops fitting a 400px map near zoom 3.2
    expect(view.zoom).toBeLessThanOrEqual(3.3)
    expect(view.tier).toBe("realm")
  })

  it("centres the Palmyrene Empire on Palmyra, a bit closer than the default, on Realms", () => {
    const view = deepDiveMapViewFor("Palmyrene Empire")
    expect(near(view.center, { lat: [34.4, 34.7], lng: [38.1, 38.4] })).toBe(
      true,
    )
    expect(view.zoom).toBeGreaterThan(DEFAULT.zoom)
    expect(view.zoom).toBeLessThan(4)
    expect(view.tier).toBe("realm")
  })

  it("ignores case and surrounding spaces", () => {
    expect(deepDiveMapViewFor("  JUDEA ")).toEqual(deepDiveMapViewFor("Judea"))
    expect(deepDiveMapViewFor("byzantine")).toEqual(
      deepDiveMapViewFor("Byzantine"),
    )
  })

  it("only ever returns a real tier", () => {
    for (const culture of [
      "Judea",
      "Carthage",
      "Byzantine",
      "Sassanian",
      "x",
    ]) {
      expect(TIERS).toContain(deepDiveMapViewFor(culture).tier)
    }
  })

  it("opens a coin older than any admin area on Realms at the default zoom, still centred on its place", () => {
    const view = deepDiveMapViewFor("Carthage", -300)
    expect(near(view.center, { lat: [36.7, 37], lng: [10.2, 10.5] })).toBe(true)
    expect(view.tier).toBe("realm")
    expect(view.zoom).toBe(DEFAULT.zoom)
    expect(deepDiveMapViewFor("Judea", -300).tier).toBe("realm")
  })

  it("keeps Admin areas from the first admin area on, and when the year is unknown", () => {
    for (const year of [FIRST_ADMIN_AREAS_YEAR, -104, 68, null, undefined]) {
      expect(deepDiveMapViewFor("Judea", year).tier, String(year)).toBe(
        "province",
      )
    }
  })

  it("does not let the year change a view that is not on Admin areas", () => {
    expect(deepDiveMapViewFor("Byzantine", -500)).toEqual(
      deepDiveMapViewFor("Byzantine"),
    )
  })

  it("names the first year the map really has an admin area", () => {
    const data = JSON.parse(
      readFileSync("public/data/jurisdictions/provinces.geojson", "utf8"),
    ) as { features: { properties: { segmentStart: number } }[] }
    const earliest = Math.min(
      ...data.features.map((f) => f.properties.segmentStart),
    )
    expect(FIRST_ADMIN_AREAS_YEAR).toBe(earliest)
  })
})
