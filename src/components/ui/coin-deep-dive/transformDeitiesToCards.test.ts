import { describe, expect, it } from "vitest"
import type { Artifact } from "~/database/schema-artifacts"
import type { CoinEnhanced } from "~/types/api"
import { transformDeitiesToCards } from "./DeepDiveCardsSection"

const artifact = (id: string, over: Partial<Artifact> = {}) =>
  ({
    id,
    name: `Artifact ${id}`,
    img_src: `https://img/${id}.jpg`,
    img_alt: `Alt ${id}`,
    img_credit: `Credit ${id}`,
    flavour_text: `Caption ${id}`,
    ...over,
  }) as Artifact

const deity = (over: Record<string, unknown> = {}) =>
  [{ id: 1, name: "Concordia", ...over }] as CoinEnhanced["deities"]

describe("transformDeitiesToCards", () => {
  it("pictures a deity with its artifacts, each with alt text, caption and credit", () => {
    const [card] = transformDeitiesToCards(
      deity({ artifact_ids: ["3", "5"] }),
      [artifact("3"), artifact("5")],
    )

    expect(card?.images).toEqual([
      {
        src: "https://img/3.jpg",
        alt: "Alt 3",
        caption: "Caption 3",
        credit: "Credit 3",
      },
      {
        src: "https://img/5.jpg",
        alt: "Alt 5",
        caption: "Caption 5",
        credit: "Credit 5",
      },
    ])
  })

  it("names the artifact when it has no alt text, and skips one with no image", () => {
    const [card] = transformDeitiesToCards(
      deity({ artifact_ids: ["3", "4"] }),
      [artifact("3", { img_alt: null }), artifact("4", { img_src: null })],
    )

    expect(card?.images).toHaveLength(1)
    expect(card?.images?.[0]?.alt).toBe("Artifact 3")
  })

  it("falls back to the deity's own image_links when it has no artifact picture", () => {
    const [card] = transformDeitiesToCards(
      deity({ artifact_ids: [], image_links: ["id-1"] }),
      [],
    )

    expect(card?.images).toEqual([{ src: "id-1", alt: "Concordia" }])
  })

  it("prefers artifacts over image_links", () => {
    const [card] = transformDeitiesToCards(
      deity({ artifact_ids: ["3"], image_links: ["id-1"] }),
      [artifact("3")],
    )

    expect(card?.images?.map((i) => i.src)).toEqual(["https://img/3.jpg"])
  })

  it("has no images for a deity with nothing", () => {
    const [card] = transformDeitiesToCards(deity(), [])
    expect(card?.images).toBeUndefined()
  })
})
