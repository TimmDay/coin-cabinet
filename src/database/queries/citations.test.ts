import type { SupabaseClient } from "@supabase/supabase-js"
import { describe, expect, it, vi } from "vitest"
import type { Database } from "~/database/database.types"
import { fetchCitations, groupCitations } from "~/database/queries/citations"
import { citationText } from "~/database/schema-citations"

const dio = {
  author: "Cassius Dio",
  title: "Roman History",
  work_editions: [
    { id: 40, is_preferred: true, url: "https://loeb.example/dio" },
    { id: 41, is_preferred: false, url: "https://perseus.example/dio" },
  ],
}
const cite = (
  id: number,
  locator: string,
  extra: Record<string, unknown> = {},
) => ({
  id,
  locator,
  applies_to: null,
  edition_id: null,
  works: dio,
  ...extra,
})

describe("groupCitations", () => {
  it("groups by the thing cited for, in the order added, with the note", () => {
    const map = groupCitations(
      [
        cite(3, "C", { deity_id: 1 }),
        cite(1, "A", { deity_id: 1, applies_to: "birthplace" }),
        cite(2, "B", { deity_id: 2 }),
      ],
      "deity_id",
    )

    expect(map.get(1)?.map((c) => c.locator)).toEqual(["A", "C"])
    expect(map.get(1)?.[0]).toEqual({
      id: 1,
      author: "Cassius Dio",
      title: "Roman History",
      locator: "A",
      url: "https://loeb.example/dio",
      note: "birthplace",
    })
    expect(map.get(2)?.map((c) => c.locator)).toEqual(["B"])
    expect(map.get(3)).toBeUndefined()
  })

  it("links to the edition named, else the Work's preferred one", () => {
    const map = groupCitations(
      [
        cite(1, "78.4", { deity_id: 1, edition_id: 41 }),
        cite(2, "78.5", { deity_id: 1 }),
      ],
      "deity_id",
    )
    expect(map.get(1)?.map((c) => c.url)).toEqual([
      "https://perseus.example/dio",
      "https://loeb.example/dio",
    ])
  })

  it("skips a citation with no Work, or none for this column", () => {
    const map = groupCitations(
      [
        cite(1, "X", { deity_id: 1, works: null }),
        cite(2, "Y", { place_id: 5, deity_id: null }),
      ],
      "deity_id",
    )
    expect(map.size).toBe(0)
  })
})

describe("citationText", () => {
  it("reads author, title, locator, leaving out a missing locator", () => {
    const base = {
      id: 1,
      author: "Unknown",
      title: "Historia Augusta",
      url: null,
      note: null,
    }
    expect(citationText({ ...base, locator: "Life of Aurelian 25.3" })).toBe(
      "Unknown, Historia Augusta, Life of Aurelian 25.3",
    )
    expect(citationText({ ...base, locator: null })).toBe(
      "Unknown, Historia Augusta",
    )
  })
})

function fakeClient(result: { data: unknown; error: unknown }) {
  const calls: Record<string, unknown[]> = {}
  const chain = {
    select: vi.fn((arg: string) => ((calls.select = [arg]), chain)),
    in: vi.fn((...args: unknown[]) => ((calls.in = args), chain)),
    order: vi.fn(() => chain),
    returns: vi.fn(() => Promise.resolve(result)),
  }
  const from = vi.fn((table: string) => ((calls.from = [table]), chain))
  return {
    client: { from } as unknown as SupabaseClient<Database>,
    calls,
    from,
  }
}

describe("fetchCitations", () => {
  it("asks citations for the given ids and groups the result", async () => {
    const { client, calls } = fakeClient({
      data: [cite(1, "Z", { mint_id: 4 })],
      error: null,
    })

    const result = await fetchCitations(client, "mint_id", [4, 5])

    expect(calls.from).toEqual(["citations"])
    expect(calls.in).toEqual(["mint_id", [4, 5]])
    expect(calls.select![0]).toContain("mint_id")
    expect(result.error).toBeNull()
    expect(result.data?.get(4)?.[0]).toMatchObject({ locator: "Z" })
  })

  it("does not query when there are no ids", async () => {
    const { client, from } = fakeClient({ data: [], error: null })
    const result = await fetchCitations(client, "place_id", [])
    expect(from).not.toHaveBeenCalled()
    expect(result.data?.size).toBe(0)
  })

  it("returns the error when the query fails", async () => {
    const { client } = fakeClient({ data: null, error: { message: "denied" } })
    const result = await fetchCitations(client, "device_id", [1])
    expect(result.data).toBeNull()
    expect(result.error).toEqual({ message: "denied" })
  })
})
