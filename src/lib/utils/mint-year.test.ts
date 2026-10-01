import { describe, expect, it } from "vitest"
import { mintedInYear } from "./mint-year"

describe("mintedInYear", () => {
  it("matches a year inside the range, ends included", () => {
    expect(mintedInYear(193, 211, 200)).toBe(true)
    expect(mintedInYear(193, 211, 193)).toBe(true)
    expect(mintedInYear(193, 211, 211)).toBe(true)
  })

  it("does not match a year outside the range", () => {
    expect(mintedInYear(193, 211, 192)).toBe(false)
    expect(mintedInYear(193, 211, 212)).toBe(false)
  })

  it("matches a single known year only", () => {
    expect(mintedInYear(218, null, 218)).toBe(true)
    expect(mintedInYear(218, null, 219)).toBe(false)
    expect(mintedInYear(undefined, 218, 218)).toBe(true)
  })

  it("never matches a coin with no mint year", () => {
    expect(mintedInYear(null, null, 200)).toBe(false)
    expect(mintedInYear(undefined, undefined, 200)).toBe(false)
  })

  it("handles BCE years and a reversed range", () => {
    expect(mintedInYear(-44, -42, -43)).toBe(true)
    expect(mintedInYear(-44, -42, 0)).toBe(false)
    expect(mintedInYear(211, 193, 200)).toBe(true)
  })
})
