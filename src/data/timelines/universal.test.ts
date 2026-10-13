import { describe, expect, it } from "vitest"
import { withUniversalEvents } from "./universal"

const e = (name: string, year: number, sequence = 6) => ({
  name,
  year,
  sequence,
})

const names = (events: { name: string }[]) => events.map((x) => x.name)

describe("withUniversalEvents", () => {
  const span = { start: 66, end: 73 }

  it("adds universal events from the start to the end year, inclusive", () => {
    const merged = withUniversalEvents(
      [e("a", 66), e("b", 70)],
      [e("u65", 65), e("u66", 66), e("u71", 71), e("u73", 73), e("u74", 74)],
      span,
    )
    expect(names(merged)).toEqual(["a", "u66", "b", "u71", "u73"])
  })

  it("uses the span, not the timeline's own first and last events", () => {
    const merged = withUniversalEvents([e("a", 70)], [e("u60", 60)], {
      start: 50,
      end: 80,
    })
    expect(names(merged)).toEqual(["u60", "a"])
  })

  it("orders by year, then the number within the year", () => {
    const merged = withUniversalEvents(
      [e("early", 70, 2), e("late", 70, 9)],
      [e("u", 70, 5)],
      span,
    )
    expect(names(merged)).toEqual(["early", "u", "late"])
  })

  it("puts the timeline's own event first on a tie", () => {
    const merged = withUniversalEvents([e("own", 70)], [e("u", 70)], span)
    expect(names(merged)).toEqual(["own", "u"])
  })

  it("gives a timeline without a span nothing from the universal one", () => {
    expect(
      names(withUniversalEvents([e("a", 70)], [e("u", 70)], null)),
    ).toEqual(["a"])
  })

  it("does not change the lists it is given", () => {
    const own = [e("b", 70), e("a", 68)]
    withUniversalEvents(own, [e("u", 69)], span)
    expect(names(own)).toEqual(["b", "a"])
  })
})
