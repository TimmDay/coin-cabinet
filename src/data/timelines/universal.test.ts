import { describe, expect, it } from "vitest"
import { withUniversalEvents } from "./universal"

const e = (id: number, event_year: number | null, year_sequence = 6) => ({
  id,
  event_year,
  year_sequence,
})

describe("withUniversalEvents", () => {
  it("adds universal events from the first to the last year, inclusive", () => {
    const merged = withUniversalEvents(
      [e(1, 66), e(2, 70), e(3, 73)],
      [e(10, 65), e(11, 66), e(12, 71), e(13, 73), e(14, 74)],
    )
    expect(merged.map((x) => x.id)).toEqual([1, 11, 2, 12, 3, 13])
  })

  it("orders by year, then the number within the year", () => {
    const merged = withUniversalEvents(
      [e(1, 70, 2), e(2, 70, 9)],
      [e(10, 70, 5)],
    )
    expect(merged.map((x) => x.id)).toEqual([1, 10, 2])
  })

  it("treats a missing number as 0", () => {
    const merged = withUniversalEvents(
      [{ id: 1, event_year: 5, year_sequence: null }, e(2, 5, 1)],
      [],
    )
    expect(merged.map((x) => x.id)).toEqual([1, 2])
  })

  it("gives a timeline with no dated events nothing from the universal one", () => {
    expect(withUniversalEvents([], [e(10, 7)])).toEqual([])
    expect(
      withUniversalEvents([e(1, null)], [e(10, 7)]).map((x) => x.id),
    ).toEqual([1])
  })

  it("ignores undated universal events", () => {
    const merged = withUniversalEvents([e(1, 10), e(2, 20)], [e(10, null)])
    expect(merged.map((x) => x.id)).toEqual([1, 2])
  })

  it("does not change the lists it is given", () => {
    const own = [e(2, 9), e(1, 5)]
    withUniversalEvents(own, [e(10, 6)])
    expect(own.map((x) => x.id)).toEqual([2, 1])
  })
})
