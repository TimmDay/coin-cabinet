import type { SupabaseClient } from "@supabase/supabase-js"
import { describe, expect, it, vi } from "vitest"
import type { Database } from "~/database/database.types"
import { fetchCitations, groupCitations } from "~/database/queries/citations"

const source = (id: number, citation: string) => ({
  id,
  author: null,
  work_title: null,
  citation,
  url: null,
})

describe("groupCitations", () => {
  it("groups by the thing cited for, in link order, with the link's note", () => {
    const map = groupCitations(
      [
        { id: 3, applies_to: null, deity_id: 1, sources: source(30, "C") },
        {
          id: 1,
          applies_to: "birthplace",
          deity_id: 1,
          sources: source(10, "A"),
        },
        { id: 2, applies_to: null, deity_id: 2, sources: source(20, "B") },
      ],
      "deity_id",
    )

    expect(map.get(1)?.map((c) => c.citation)).toEqual(["A", "C"])
    expect(map.get(1)?.[0]).toMatchObject({
      id: 10,
      citation: "A",
      note: "birthplace",
    })
    expect(map.get(2)?.map((c) => c.citation)).toEqual(["B"])
    expect(map.get(3)).toBeUndefined()
  })

  it("skips a link with no source, or none for this column", () => {
    const map = groupCitations(
      [
        { id: 1, applies_to: null, deity_id: 1, sources: null },
        {
          id: 2,
          applies_to: null,
          place_id: 5,
          deity_id: null,
          sources: source(1, "X"),
        },
      ],
      "deity_id",
    )
    expect(map.size).toBe(0)
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
  it("asks entity_sources for the given ids and groups the result", async () => {
    const { client, calls } = fakeClient({
      data: [{ id: 1, applies_to: null, mint_id: 4, sources: source(9, "Z") }],
      error: null,
    })

    const result = await fetchCitations(client, "mint_id", [4, 5])

    expect(calls.from).toEqual(["entity_sources"])
    expect(calls.in).toEqual(["mint_id", [4, 5]])
    expect(calls.select![0]).toContain("mint_id")
    expect(result.error).toBeNull()
    expect(result.data?.get(4)?.[0]).toMatchObject({ citation: "Z" })
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
