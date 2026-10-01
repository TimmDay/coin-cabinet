import { describe, expect, it } from "vitest"
import { uniqueHeadingId } from "./heading-ids"

describe("uniqueHeadingId", () => {
  it("builds an id from the text", () => {
    expect(uniqueHeadingId("Historical Context", "", new Set())).toBe(
      "historical-context",
    )
    expect(uniqueHeadingId("Early Lives & Rise to Power!", "", new Set())).toBe(
      "early-lives-rise-to-power",
    )
  })

  it("keeps a heading's own id", () => {
    expect(uniqueHeadingId("Anything", "modal-title", new Set())).toBe(
      "modal-title",
    )
  })

  it("numbers repeats so every id is unique", () => {
    const used = new Set<string>()
    const ids = [
      "Historical Context",
      "The Joint Rule",
      "Historical Context",
      "Historical Context",
    ].map((t) => uniqueHeadingId(t, "", used))
    expect(ids).toEqual([
      "historical-context",
      "the-joint-rule",
      "historical-context-2",
      "historical-context-3",
    ])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("renumbers a duplicated own id too", () => {
    const used = new Set<string>()
    expect(uniqueHeadingId("A", "intro", used)).toBe("intro")
    expect(uniqueHeadingId("B", "intro", used)).toBe("intro-2")
  })

  it("falls back to a name for an empty heading", () => {
    const used = new Set<string>()
    expect(uniqueHeadingId("", "", used)).toBe("section")
    expect(uniqueHeadingId("!!!", "", used)).toBe("section-2")
  })
})
