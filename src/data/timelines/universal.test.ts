import { describe, expect, it } from "vitest"
import { withUniversalEvents } from "./universal"

const e = (name: string, year: number, sequence = 6) => ({
  name,
  year,
  sequence,
})

const names = (events: { name: string }[]) => events.map((x) => x.name)

describe("withUniversalEvents", () => {
  it("adds universal events from the first to the last year, inclusive", () => {
    const merged = withUniversalEvents(
      [e("a", 66), e("b", 70), e("c", 73)],
      [e("u65", 65), e("u66", 66), e("u71", 71), e("u73", 73), e("u74", 74)],
    )
    expect(names(merged)).toEqual(["a", "u66", "b", "u71", "c", "u73"])
  })

  it("orders by year, then the number within the year", () => {
    const merged = withUniversalEvents(
      [e("early", 70, 2), e("late", 70, 9)],
      [e("u", 70, 5)],
    )
    expect(names(merged)).toEqual(["early", "u", "late"])
  })

  it("puts the timeline's own event first on a tie", () => {
    const merged = withUniversalEvents([e("own", 70)], [e("u", 70)])
    expect(names(merged)).toEqual(["own", "u"])
  })

  it("gives an empty timeline nothing from the universal one", () => {
    expect(withUniversalEvents([], [e("u", 7)])).toEqual([])
  })

  it("does not change the lists it is given", () => {
    const own = [e("b", 9), e("a", 5)]
    withUniversalEvents(own, [e("u", 6)])
    expect(names(own)).toEqual(["b", "a"])
  })
})
