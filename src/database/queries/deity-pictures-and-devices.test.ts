import type { SupabaseClient } from "@supabase/supabase-js"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { Database } from "~/database/database.types"
import { fetchDeityArtifactIds, fetchDeityDeviceNames } from "./deities"

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

// A client whose tables each answer a fixed set of rows
function tablesClient(tables: Record<string, unknown[]>) {
  return {
    from: (table: string) => ({
      select: () => ({
        in: () => Promise.resolve({ data: tables[table] ?? [], error: null }),
      }),
    }),
  } as unknown as SupabaseClient<Database>
}

describe("fetchDeityDeviceNames", () => {
  it("lists each deity's device names alphabetically", async () => {
    const client = tablesClient({
      device_deities: [
        { deity_id: 1, device_id: 10 },
        { deity_id: 1, device_id: 11 },
        { deity_id: 2, device_id: 11 },
      ],
      devices: [
        { id: 10, name: "Patera" },
        { id: 11, name: "Cornucopia" },
      ],
    })

    const { data } = await fetchDeityDeviceNames(client, [1, 2])

    expect(data?.get(1)).toEqual(["Cornucopia", "Patera"])
    expect(data?.get(2)).toEqual(["Cornucopia"])
  })

  it("is empty for deities with no devices, without asking for devices", async () => {
    const client = tablesClient({
      device_deities: [],
      devices: [{ id: 1, name: "X" }],
    })

    expect((await fetchDeityDeviceNames(client, [1])).data?.size).toBe(0)
  })
})
