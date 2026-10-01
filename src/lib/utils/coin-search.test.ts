import { describe, expect, it } from "vitest"
import { coinMatchesSearch } from "./coin-search"

const coin = {
  nickname: "Aquilia Severa",
  denomination: "Denarius",
  legend_o: "IVLIA AQVILIA SEVERA AVG",
  legend_r: "CONCORDIA",
}

describe("coinMatchesSearch", () => {
  it("matches the denomination, ignoring case", () => {
    expect(coinMatchesSearch(coin, "", "denarius")).toBe(true)
    expect(coinMatchesSearch(coin, "", "DENARIUS")).toBe(true)
    expect(coinMatchesSearch(coin, "", "denar")).toBe(true)
  })

  it("does not match a different denomination", () => {
    expect(coinMatchesSearch(coin, "", "antoninianus")).toBe(false)
  })

  it("still matches everything it matched before", () => {
    expect(coinMatchesSearch(coin, "", "aquilia")).toBe(true) // nickname
    expect(coinMatchesSearch(coin, "", "ivlia")).toBe(true) // obverse legend
    expect(coinMatchesSearch(coin, "", "concordia")).toBe(true) // reverse legend
    expect(coinMatchesSearch(coin, "Elagabal Vesta", "vesta")).toBe(true) // deities
  })

  it("matches every coin for an empty or blank query", () => {
    expect(coinMatchesSearch(coin, "", "")).toBe(true)
    expect(coinMatchesSearch(coin, "", "   ")).toBe(true)
  })

  it("copes with missing fields", () => {
    expect(coinMatchesSearch({}, "", "denarius")).toBe(false)
    expect(coinMatchesSearch({ denomination: null }, "", "x")).toBe(false)
  })
})
