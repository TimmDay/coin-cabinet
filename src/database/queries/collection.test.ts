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
    { id: 11, name: "British Museum", lat: 51.5, lng: -0.12 },
  ],
  deity_artifacts: [
    { deity_id: 5, artifact_id: 31 },
    { deity_id: 5, artifact_id: 30 },
  ],
  item_presentation: [{ id: 100, item_id: 7 }],
  supporting_images: [
    { presentation_id: 100, sequence: 1, artifacts: { id: 30 } },
  ],
  artifacts: [
    {
      id: 30,
      name: "Bust of Aurelian",
      place_id: 11,
      location_note: "Room 70",
    },
    { id: 31, name: "Sol relief", place_id: null, location_note: null },
    { id: 32, name: "Unrelated", place_id: 11, location_note: null },
  ],
  coin_devices: [
    { coin_id: 70, device_id: 40, side: "obverse" },
    { coin_id: 70, device_id: 41, side: "reverse" },
  ],
  devices: [
    { id: 40, name: "Radiate bust" },
    { id: 41, name: "Sol standing" },
    { id: 42, name: "Unrelated" },
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
        places: [expect.objectContaining({ id: 9, name: "Rome" })],
        citations: [expect.objectContaining({ id: 1, title: "New History" })],
      }),
    ])
  })

  it("gives each deity the artifacts that picture it, in id order", async () => {
    const { data } = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(data?.deities?.[0]?.artifacts.map((a) => a.id)).toEqual(["30", "31"])
  })

  it("resolves the coin's supporting artifacts with where they are held", async () => {
    const { data } = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(data?.supporting_artifacts).toEqual([
      expect.objectContaining({
        id: "30",
        name: "Bust of Aurelian",
        institution_name: "British Museum",
        location_name: "Room 70",
        lat: 51.5,
      }),
    ])
  })

  it("gives each face only its own devices", async () => {
    const { data } = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(data?.obv_devices?.map((d) => d.name)).toEqual(["Radiate bust"])
    expect(data?.rev_devices?.map((d) => d.name)).toEqual(["Sol standing"])
  })

  it.each(["artifacts", "devices"])(
    "still loads the coin when its %s fail, but is partial",
    async (table) => {
      const result = await fetchCollectionDetail(
        fakeSupabase(tables, [table]).client,
        7,
      )
      expect(result.data?.id).toBe(7)
      expect(result.partial).toBe(true)
    },
  )

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

  // Only the mint read touches mint_operation_periods, so this is the mint's
  // own partial read reaching the coin's
  it("keeps the mint but is partial when the mint's own extras fail", async () => {
    const result = await fetchCollectionDetail(
      fakeSupabase(tables, ["mint_operation_periods"]).client,
      7,
    )
    expect(result.data?.mint).toMatchObject({ id: 2, name: "Rome" })
    expect(result.partial).toBe(true)
  })

  it("is whole when nothing optional fails", async () => {
    const result = await fetchCollectionDetail(fakeSupabase(tables).client, 7)
    expect(result.partial).toBe(false)
  })
})
