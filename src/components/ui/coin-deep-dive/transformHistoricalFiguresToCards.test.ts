import { describe, expect, it } from "vitest"
import type { CoinPerson } from "~/types/api"
import { transformHistoricalFiguresToCards } from "./DeepDiveCardsSection"

const person = (over: Partial<CoinPerson> = {}): CoinPerson => ({
  id: 1,
  name: "Aurelian",
  full_name: null,
  authority: null,
  reign_start: null,
  reign_end: null,
  birth: null,
  death: null,
  altNames: null,
  flavour_text: null,
  artifact_ids: [],
  citations: [],
  ...over,
})

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
    const [card] = transformHistoricalFiguresToCards(
      [person({ citations: [citation] })],
      [],
    )
    expect(card?.citations).toEqual([citation])
  })

  it("subtitles a figure with their title, life and reign", () => {
    const [card] = transformHistoricalFiguresToCards(
      [
        person({
          authority: "Emperor",
          birth: 214,
          death: 275,
          reign_start: 270,
          reign_end: 275,
        }),
      ],
      [],
    )
    expect(card?.subtitle).toBe("Emperor, lived 214—275 CE, reigned 270—275 CE")
  })

  it("leaves out the parts of a subtitle that are unknown", () => {
    const [card] = transformHistoricalFiguresToCards([person()], [])
    expect(card?.subtitle).toBe("")
  })

  it("footers a figure with their other names, else their full name", () => {
    const [named, full] = transformHistoricalFiguresToCards(
      [
        person({
          altNames: ["Restitutor Orbis"],
          full_name: "L. D. Aurelianus",
        }),
        person({ full_name: "L. D. Aurelianus" }),
      ],
      [],
    )
    expect(named?.footer).toBe("Restitutor Orbis")
    expect(full?.footer).toBe("L. D. Aurelianus")
  })
})
