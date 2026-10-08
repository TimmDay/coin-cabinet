import type { SupabaseClient } from "@supabase/supabase-js"
import { describe, expect, it, vi } from "vitest"
import type { Database } from "~/database/database.types"
import { fetchTimelines } from "~/database/queries/timelines"

vi.mock("~/database/queries/citations", () => ({
  fetchCitations: () => Promise.resolve({ data: new Map(), error: null }),
}))

const timeline = {
  id: 1,
  name: "aurelian",
  is_universal: false,
  created_at: "",
  updated_at: "",
}
const universalTimeline = {
  id: 9,
  name: "Universal Timeline Roman",
  is_universal: true,
  created_at: "",
  updated_at: "",
}
const event = (id: number, name: string, year: number, timeline_id = 1) => ({
  id,
  timeline_id,
  name,
  event_type: "military",
  event_year: year,
  year_sequence: 6,
  place_id: null,
  location_note: null,
  lat: null,
  lng: null,
  flavour_text: null,
})

/** A client whose queries resolve to the given rows and record how events were ordered */
function fakeClient(events: unknown[], timelines: unknown[] = [timeline]) {
  const eventOrder: [string, unknown][] = []
  const rowsFor: Record<string, unknown[]> = {
    timelines,
    timeline_events: events,
    places: [],
  }
  const from = (table: string) => {
    const chain: Record<string, unknown> = {
      select: () => chain,
      in: () => chain,
      order: (column: string, options: unknown) => {
        if (table === "timeline_events") eventOrder.push([column, options])
        return chain
      },
      then: (resolve: (value: unknown) => unknown) =>
        resolve({ data: rowsFor[table], error: null }),
    }
    return chain
  }
  return {
    client: { from } as unknown as SupabaseClient<Database>,
    eventOrder,
  }
}

describe("fetchTimelines", () => {
  it("orders events by year, then the number within the year, then id", async () => {
    const { client, eventOrder } = fakeClient([event(1, "Born", 214)])
    await fetchTimelines(client)
    expect(eventOrder).toEqual([
      ["event_year", { ascending: true }],
      ["year_sequence", { ascending: true }],
      ["id", { ascending: true }],
    ])
  })

  it("keeps the events in the order the database returned them", async () => {
    const { client } = fakeClient([
      event(1, "Born", 214),
      event(2, "Proclaimed Emperor", 270),
    ])
    const result = await fetchTimelines(client)
    expect(result.data?.[0]?.timeline.map((e) => e.name)).toEqual([
      "Born",
      "Proclaimed Emperor",
    ])
  })

  it("shows universal events on a timeline whose years contain them, in place", async () => {
    const { client } = fakeClient(
      [
        event(1, "Born", 214),
        event(2, "Proclaimed Emperor", 270),
        event(10, "Plague begins", 249, 9),
        event(11, "Before Aurelian was born", 100, 9),
        event(12, "After Aurelian", 300, 9),
      ],
      [timeline, universalTimeline],
    )
    const result = await fetchTimelines(client)
    const aurelian = result.data?.find((t) => t.name === "aurelian")
    expect(aurelian?.timeline.map((e) => e.name)).toEqual([
      "Born",
      "Plague begins",
      "Proclaimed Emperor",
    ])
  })

  it("leaves the universal timeline with only its own events", async () => {
    const { client } = fakeClient(
      [event(1, "Born", 214), event(10, "Plague begins", 249, 9)],
      [timeline, universalTimeline],
    )
    const result = await fetchTimelines(client)
    const universal = result.data?.find((t) => t.id === 9)
    expect(universal?.timeline.map((e) => e.name)).toEqual(["Plague begins"])
  })
})
