import { describe, expect, it } from "vitest"
import {
  isWithinMapBounds,
  parseLatLng,
  parseMapPosition,
  parseZoom,
  ROME,
} from "./coordinates"

describe("parseLatLng", () => {
  it("accepts numbers and numeric strings", () => {
    expect(parseLatLng(41.9, 12.5)).toEqual([41.9, 12.5])
    expect(parseLatLng("41.9", "12.5")).toEqual([41.9, 12.5])
  })

  it("treats zero as a real coordinate", () => {
    expect(parseLatLng(0, 0)).toEqual([0, 0])
  })

  it.each([
    [undefined, 12],
    [41, null],
    [Number.NaN, 12],
    [Infinity, 12],
    ["", 12],
    ["north", 12],
    [91, 12],
    [41, 181],
  ])("rejects %s, %s", (lat, lng) => {
    expect(parseLatLng(lat, lng)).toBeNull()
  })
})

describe("parseMapPosition", () => {
  it("keeps positions inside the map and drops the rest", () => {
    expect(parseMapPosition(...ROME)).toEqual(ROME)
    expect(parseMapPosition(0, 0)).toBeNull()
    expect(parseMapPosition(Number.NaN, 12)).toBeNull()
  })
})

describe("isWithinMapBounds", () => {
  it("includes the edges and excludes beyond them", () => {
    expect(isWithinMapBounds([65, -15])).toBe(true)
    expect(isWithinMapBounds([20, 55])).toBe(true)
    expect(isWithinMapBounds([65.1, 12])).toBe(false)
    expect(isWithinMapBounds([41, 55.1])).toBe(false)
  })
})

describe("parseZoom", () => {
  it("falls back unless the zoom is a number above zero", () => {
    expect(parseZoom(6, 5)).toBe(6)
    expect(parseZoom("6", 5)).toBe(6)
    expect(parseZoom(0, 5)).toBe(5)
    expect(parseZoom(-1, 5)).toBe(5)
    expect(parseZoom(undefined, 5)).toBe(5)
    expect(parseZoom(Number.NaN, 5)).toBe(5)
  })
})
