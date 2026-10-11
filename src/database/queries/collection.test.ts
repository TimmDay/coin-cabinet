import { describe, expect, it } from "vitest"
import { fetchCollectionDetail } from "~/database/queries/collection"
import { fakeSupabase } from "~/database/queries/fakeSupabase"

const work = { author: "Zosimus", title: "New History", work_editions: [] }
const citation = (id: number, link: Record<string, number>) => ({
  id,
  locator: `1.${id}`,
  applies_to: null,
  edition_id: null,
  works: work,
  ...link,
})

const tables = {
  public_items: [
    { id: 7, brief_description: "Aurelian", denomination: "Antoninianus" },
  ],
  coins: [{ id: 70, item_id: 7, mint_id: 2, mint_mark: "XXIR" }],
  item_deities: [{ item_id: 7, deity_id: 5 }],
  deities: [
    {
      id: 5,
      name: "Sol",
      subtitle: "Unconquered Sun",
      flavour_text: "Sol Invictus",
      secondary_info: null,
      place_ids: [{ place_id: 9 }],
    },
  ],
  item_persons: [{ item_id: 7, person_id: 3 }],
  persons: [
    {
      id: 3,
      name: "Aurelian",
      full_name: "Lucius Domitius Aurelianus",
      title: "Emperor",
      reign_start: 270,
      reign_end: 275,
      birth_year: 214,
      death_year: 275,
      alt_names: null,
      flavour_text: "Restorer of the world",
    },
  ],
  mints: [
    {
      id: 2,
      place_id: 9,
      mint_marks: ["XXIR"],
      flavour_text: "The mint of Rome",
    },
    { id: 4, place_id: 10, flavour_text: "Another mint" },
  ],
  places: [
    { id: 9, name: "Rome", lat: 41.9, lng: 12.5 },
    { id: 10, name: "Siscia", lat: 45.5, lng: 16.4 },
  ],
  citations: [
    citation(1, { deity_id: 5 }),
    citation(2, { person_id: 3 }),
    citation(3, { mint_id: 2 }),
  ],
}

describe("fetchCollectionDetail", () => {
  it("gives the coin's deities their citations", async () => {
    const { data } = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(data?.deities).toEqual([
      expect.objectContaining({
        id: 5,
        name: "Sol",
        place_ids: [9],
        citations: [expect.objectContaining({ id: 1, title: "New History" })],
      }),
    ])
  })

  it("gives the coin's persons their citations", async () => {
    const { data } = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(data?.historical_figures).toEqual([
      expect.objectContaining({
        name: "Aurelian",
        authority: "Emperor",
        birth: 214,
        citations: [expect.objectContaining({ id: 2 })],
      }),
    ])
  })

  it("resolves the coin's own mint, named for its place, with citations", async () => {
    const { data } = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(data?.mint).toMatchObject({
      id: 2,
      name: "Rome",
      lat: 41.9,
      flavour_text: "The mint of Rome",
      citations: [expect.objectContaining({ id: 3 })],
    })
  })

  it("has no mint when the coin records none", async () => {
    const { data } = await fetchCollectionDetail(
      fakeSupabase({
        ...tables,
        coins: [{ id: 70, item_id: 7, mint_id: null }],
      }).client,
      7,
    )
    expect(data?.mint).toBeNull()
  })
})
