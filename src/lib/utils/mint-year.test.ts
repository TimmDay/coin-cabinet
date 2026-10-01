import { describe, expect, it } from "vitest"
import { overlapsYearRange } from "./mint-year"

describe("overlapsYearRange", () => {
  it("matches everything when no bound is given", () => {
    expect(overlapsYearRange(193, 211, null, null)).toBe(true)
    expect(overlapsYearRange(null, null, null, null)).toBe(true)
  })

  it("matches a coin whose range overlaps the range, ends included", () => {
    expect(overlapsYearRange(193, 211, 200, 250)).toBe(true) // overlaps the start
    expect(overlapsYearRange(193, 211, 150, 200)).toBe(true) // overlaps the end
    expect(overlapsYearRange(193, 211, 195, 200)).toBe(true) // range inside the coin's
    expect(overlapsYearRange(193, 211, 211, 300)).toBe(true) // touching
    expect(overlapsYearRange(193, 211, 100, 193)).toBe(true) // touching
  })

  it("rejects a coin entirely before or after the range", () => {
    expect(overlapsYearRange(193, 211, 212, 300)).toBe(false)
    expect(overlapsYearRange(193, 211, 100, 192)).toBe(false)
  })

  it("supports an open end on either side", () => {
    expect(overlapsYearRange(193, 211, 200, null)).toBe(true)
    expect(overlapsYearRange(193, 211, 212, null)).toBe(false)
    expect(overlapsYearRange(193, 211, null, 200)).toBe(true)
    expect(overlapsYearRange(193, 211, null, 192)).toBe(false)
  })

  it("treats a coin with one known year as that year", () => {
    expect(overlapsYearRange(218, null, 200, 220)).toBe(true)
    expect(overlapsYearRange(undefined, 218, 219, null)).toBe(false)
  })

  it("rejects a coin with no mint year once a bound is given", () => {
    expect(overlapsYearRange(null, null, 200, null)).toBe(false)
    expect(overlapsYearRange(undefined, undefined, null, 200)).toBe(false)
  })

  it("handles BCE years and a reversed coin range", () => {
    expect(overlapsYearRange(-104, -79, -90, -50)).toBe(true)
    expect(overlapsYearRange(-104, -79, 0, 100)).toBe(false)
    expect(overlapsYearRange(211, 193, 200, 250)).toBe(true)
  })
})
