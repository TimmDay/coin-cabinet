import { afterEach, describe, expect, it, vi } from "vitest"
import { optionalParts } from "./optional-parts"

afterEach(() => vi.restoreAllMocks())

describe("optionalParts", () => {
  it("passes a lookup's data through, and stays whole", () => {
    const parts = optionalParts()
    expect(parts.take("x", { data: [1], error: null }, [])).toEqual([1])
    expect(parts.partial).toBe(false)
  })

  it("uses the fallback for a failed lookup, logs it, and turns partial", () => {
    const logged = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)
    const parts = optionalParts()

    expect(
      parts.take("citations", { data: null, error: { message: "boom" } }, []),
    ).toEqual([])
    expect(parts.partial).toBe(true)
    expect(logged).toHaveBeenCalledWith("citations query failed:", {
      message: "boom",
    })
  })

  it("uses the fallback for a lookup that found nothing, without turning partial", () => {
    const parts = optionalParts()
    expect(parts.take("presentation", { data: null, error: null }, null)).toBe(
      null,
    )
    expect(parts.partial).toBe(false)
  })
})
