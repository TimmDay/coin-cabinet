import { describe, expect, it } from "vitest"
import type { CoinEnhanced } from "~/types/api"
import { transformHistoricalFiguresToCards } from "./DeepDiveCardsSection"

describe("transformHistoricalFiguresToCards", () => {
  it("carries the figure's citations onto its card", () => {
    const citation = {
      id: 3,
      author: "Eutropius",
      title: "Breviarium",
      locator: "9.13",
      url: null,
      note: null,
    }
    const figures = [
      { id: 1, name: "Aurelian", citations: [citation] },
    ] as CoinEnhanced["historical_figures"]

    const [card] = transformHistoricalFiguresToCards(figures, [])
    expect(card?.citations).toEqual([citation])
  })

  it("leaves a figure with no citations without a list", () => {
    const figures = [
      { id: 1, name: "Aurelian" },
    ] as CoinEnhanced["historical_figures"]

    const [card] = transformHistoricalFiguresToCards(figures, [])
    expect(card?.citations).toBeUndefined()
  })
})
