import { describe, expect, it } from "vitest"
import {
  formatOpenYearRange,
  formatTimelineYear,
  formatYear,
  formatYearRange,
  fromAstronomical,
  isYear,
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

  it.each([
    [-200, "200 BCE"],
    [-1, "1 BCE"],
    [1, "1 CE"],
    [117, "117 CE"],
  ])("formats %s as %s", (year, expected) => {
    expect(formatYear(year)).toBe(expected)
  })

  it("leaves CE bare on timeline markers, where space is tight", () => {
    expect(formatTimelineYear(117)).toBe("117")
    expect(formatTimelineYear(-44)).toBe("44 BCE")
  })

  it("treats 0, null and undefined as no year", () => {
    expect(isYear(0)).toBe(false)
    expect(isYear(null)).toBe(false)
    expect(isYear(undefined)).toBe(false)
    expect(isYear(-1)).toBe(true)
  })

  it.each([
    [193, 211, "193—211 CE"],
    [-336, -323, "336—323 BCE"],
    [-27, 14, "27 BCE—14 CE"],
    [117, 117, "117 CE"],
  ])("formats %s to %s as %s", (earliest, latest, expected) => {
    expect(formatYearRange(earliest, latest)).toBe(expected)
  })

  it("shows the known end when the other is missing", () => {
    expect(formatYearRange(-44, null)).toBe("44 BCE")
    expect(formatYearRange(-44, 0)).toBe("44 BCE")
    expect(formatYearRange(undefined, 14)).toBe("14 CE")
    expect(formatYearRange(0, null)).toBe("")
  })

  it("says from or until when a run of years is open at one end", () => {
    expect(formatOpenYearRange(-260, 0)).toBe("from 260 BCE")
    expect(formatOpenYearRange(null, 14)).toBe("until 14 CE")
    expect(formatOpenYearRange(270, 275)).toBe("270—275 CE")
    expect(formatOpenYearRange(0, 0)).toBe("")
  })
})
