import type { SupabaseClient } from "@supabase/supabase-js"
import { describe, expect, it } from "vitest"
import type { Database } from "~/database/database.types"
import {
  fetchClockNotes,
  resolveClockNotes,
  type LinkedEntries,
} from "~/database/queries/clock-notes"

type Row = Database["public"]["Tables"]["item_clock_notes"]["Row"]

const row = (overrides: Partial<Row>): Row => ({
  id: 1,
  item_id: 10,
  side: "obverse",
  clock_position: 3,
  title: null,
  body: null,
  link_url: null,
  link_label: null,
  device_id: null,
  deity_id: null,
  place_id: null,
  person_id: null,
  mint_id: null,
  artifact_id: null,
  created_at: "",
  updated_at: "",
  ...overrides,
})

const entries = (): LinkedEntries => ({
  device: new Map([
    [
      7,
      {
        title: "Cornucopia",
        body: "Horn of plenty.",
        imageUrl: "https://img/c.jpg",
        imageCredit: "Photo by Tim",
      },
    ],
  ]),
  deity: new Map([[2, { title: "Sol", body: null }]]),
  place: new Map(),
  person: new Map(),
  mint: new Map(),
  artifact: new Map(),
})

describe("resolveClockNotes", () => {
  it("keeps text written on the note", () => {
    const [note] = resolveClockNotes(
      [row({ title: "Own", body: "Own body" })],
      entries(),
    )
    expect(note).toMatchObject({ title: "Own", body: "Own body" })
  })

  it("fills a missing title and body from the linked entry", () => {
    const [note] = resolveClockNotes([row({ device_id: 7 })], entries())
    expect(note).toMatchObject({ title: "Cornucopia", body: "Horn of plenty." })
  })

  it("carries the linked entry's picture, and none when it has none", () => {
    const [withImage] = resolveClockNotes([row({ device_id: 7 })], entries())
    const [without] = resolveClockNotes([row({ deity_id: 2 })], entries())

    expect(withImage?.imageUrl).toBe("https://img/c.jpg")
    expect(withImage?.imageCredit).toBe("Photo by Tim")
    expect(without?.imageUrl).toBeNull()
    expect(without?.imageCredit).toBeNull()
  })

  it("gives a note with its own text no picture", () => {
    const [note] = resolveClockNotes([row({ body: "Own" })], entries())
    expect(note?.imageUrl).toBeNull()
  })

  it("lets the note override the linked entry's text", () => {
    const [note] = resolveClockNotes(
      [row({ device_id: 7, body: "Mine" })],
      entries(),
    )
    expect(note).toMatchObject({ title: "Cornucopia", body: "Mine" })
  })

  it("keeps a title-only note when the entry has no body", () => {
    const [note] = resolveClockNotes([row({ deity_id: 2 })], entries())
    expect(note).toMatchObject({ title: "Sol", body: null })
  })

  it("drops a note whose linked entry is missing and that has no text", () => {
    expect(resolveClockNotes([row({ device_id: 99 })], entries())).toEqual([])
  })

  it("names what a note links to, and nothing for a note of its own", () => {
    const notes = resolveClockNotes(
      [
        row({ id: 1, clock_position: 1, device_id: 7 }),
        row({ id: 2, clock_position: 2, deity_id: 2 }),
        row({ id: 3, clock_position: 3, body: "Own" }),
      ],
      entries(),
    )
    expect(notes.map((n) => n.linkKind)).toEqual(["device", "deity", null])
  })

  it("sorts by side, then position, and passes the link through", () => {
    const notes = resolveClockNotes(
      [
        row({ id: 1, side: "reverse", clock_position: 2, body: "a" }),
        row({
          id: 2,
          side: "obverse",
          clock_position: 9,
          body: "b",
          link_url: "https://example.com",
          link_label: "More",
        }),
        row({ id: 3, side: "obverse", clock_position: 1, body: "c" }),
      ],
      entries(),
    )
    expect(notes.map((n) => [n.side, n.position])).toEqual([
      ["obverse", 1],
      ["obverse", 9],
      ["reverse", 2],
    ])
    expect(notes[1]).toMatchObject({
      linkUrl: "https://example.com",
      linkLabel: "More",
    })
  })
})

describe("fetchClockNotes for a deity link", () => {
  it("shows the deity's name as the title and its subtitle as the body", async () => {
    const selected: string[] = []
    const client = {
      from: (table: string) => ({
        select: (columns: string) => {
          if (table === "deities") selected.push(columns)
          const result =
            table === "item_clock_notes"
              ? { data: [row({ deity_id: 2 })], error: null }
              : {
                  data: [{ id: 2, name: "Sol", subtitle: "God of the sun" }],
                  error: null,
                }
          const query = {
            eq: () => query,
            in: () => query,
            returns: () => Promise.resolve(result),
          }
          return query
        },
      }),
    } as unknown as SupabaseClient<Database>

    const { data } = await fetchClockNotes(client, 10)

    expect(data).toMatchObject([
      { title: "Sol", body: "God of the sun", linkKind: "deity" },
    ])
    expect(selected).toEqual(["id, name, subtitle"])
  })
})
