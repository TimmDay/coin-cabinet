import type { SupabaseClient } from "@supabase/supabase-js"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { Database } from "~/database/database.types"
import { fetchDeityArtifactIds } from "./deities"

function fakeClient(result: { data: unknown; error: unknown }) {
  const calls: unknown[][] = []
  const client = {
    from: (table: string) => ({
      select: () => ({
        in: (column: string, ids: number[]) => {
          calls.push([table, column, ids])
          return Promise.resolve(result)
        },
      }),
    }),
  } as unknown as SupabaseClient<Database>
  return { client, calls }
}

afterEach(() => vi.restoreAllMocks())

describe("fetchDeityArtifactIds", () => {
  it("groups artifact ids by deity, in artifact id order, as strings", async () => {
    const { client, calls } = fakeClient({
      data: [
        { deity_id: 1, artifact_id: 5 },
        { deity_id: 2, artifact_id: 9 },
        { deity_id: 1, artifact_id: 3 },
      ],
      error: null,
    })

    const map = await fetchDeityArtifactIds(client, [1, 2])

    expect(calls).toEqual([["deity_artifacts", "deity_id", [1, 2]]])
    expect(map.get(1)).toEqual(["3", "5"])
    expect(map.get(2)).toEqual(["9"])
  })

  it("does not query for no deities", async () => {
    const { client, calls } = fakeClient({ data: [], error: null })

    expect((await fetchDeityArtifactIds(client, [])).size).toBe(0)
    expect(calls).toEqual([])
  })

  it("leaves deities without pictures when the table is missing, instead of failing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const { client } = fakeClient({
      data: null,
      error: { message: 'relation "deity_artifacts" does not exist' },
    })

    expect((await fetchDeityArtifactIds(client, [1])).size).toBe(0)
  })
})
