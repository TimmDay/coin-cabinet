import { describe, expect, it } from "vitest"
import {
  fromAstronomical,
  nextYear,
  toAstronomical,
  yearsBetween,
} from "./years"

describe("years", () => {
  it("puts 1 BC at astronomical 0 and AD 1 at 1", () => {
    expect(toAstronomical(-1)).toBe(0)
    expect(toAstronomical(-44)).toBe(-43)
    expect(toAstronomical(1)).toBe(1)
    expect(toAstronomical(117)).toBe(117)
  })

  it("comes back from astronomical numbering without a year zero", () => {
    for (const year of [-400, -44, -1, 1, 14, 1453]) {
      expect(fromAstronomical(toAstronomical(year))).toBe(year)
    }
    expect(fromAstronomical(0)).toBe(-1)
  })

  it("goes from 1 BC straight to AD 1", () => {
    expect(nextYear(-2)).toBe(-1)
    expect(nextYear(-1)).toBe(1)
    expect(nextYear(1)).toBe(2)
  })

  it("counts one year from 1 BC to AD 1", () => {
    expect(yearsBetween(-1, 1)).toBe(1)
    // Augustus' reign: 27 BC to AD 14 is 40 years, not 41
    expect(yearsBetween(-27, 14)).toBe(40)
    expect(yearsBetween(100, 117)).toBe(17)
  })
})
