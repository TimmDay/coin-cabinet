import { describe, expect, it } from "vitest"
import type { CoinEnhanced } from "~/types/api"
import { buildCoinMap, type CoinMapReference } from "./coinMap"

const coin = (overrides: Partial<CoinEnhanced> = {}) =>
  ({
    id: 7,
    nickname: "Test",
    denomination: "denarius",
    ...overrides,
  }) as CoinEnhanced

const rome = { id: 1, name: "Rome mint", lat: 41.9, lng: 12.5 }
const reference = (r: Record<string, unknown> = {}) => r as CoinMapReference

const place = (id: number, lat: number, lng: number) => ({
  id,
  name: `Place ${id}`,
  lat,
  lng,
})

describe("buildCoinMap", () => {
  it("is null when there is nothing to map", () => {
    expect(buildCoinMap(coin(), reference())).toBeNull()
    expect(
      buildCoinMap(coin({ mint_id: 1 }), reference({ mints: [] })),
    ).toBeNull()
  })

  it("pins where a coin was struck, with the year", () => {
    const map = buildCoinMap(
      coin({ mint_id: 1, mint_year_earliest: 200 }),
      reference({ mints: [rome] }),
    )

    expect(map?.kind).toBe("markers")
    expect(map?.markers).toHaveLength(1)
    expect(map?.markers[0]).toMatchObject({
      id: "coin-mint-7",
      title: "Rome mint",
      subtitle: "This coin was minted here",
      description: "Minted around 200",
    })
  })

  it("orders the mint pin first and the find pin last", () => {
    const map = buildCoinMap(
      coin({
        mint_id: 1,
        found_event: {
          lat: 51.5,
          lng: -0.1,
          notes: "A field",
          event_date: "1999",
        },
      } as Partial<CoinEnhanced>),
      reference({ mints: [rome] }),
    )

    expect(map?.markers.map((m) => m.id)).toEqual([
      "coin-mint-7",
      "coin-found-7",
    ])
  })

  it("leaves out a mint or find with unusable coordinates, and keeps a zero", () => {
    const equator = { id: 2, name: "Equator mint", lat: 20, lng: 0 }
    const map = buildCoinMap(
      coin({
        mint_id: 2,
        found_event: { lat: Number.NaN, lng: 3, notes: null, event_date: "1" },
      } as Partial<CoinEnhanced>),
      reference({ mints: [equator] }),
    )

    expect(map?.markers.map((m) => m.id)).toEqual(["coin-mint-7"])
    expect(
      buildCoinMap(
        coin({ mint_id: 3 }),
        reference({ mints: [{ ...rome, id: 3, lat: Number.NaN }] }),
      ),
    ).toBeNull()
  })

  it("pins a deity's places, naming every deity that shares one", () => {
    const map = buildCoinMap(
      coin({ deity_id: ["1", "2"] }),
      reference({
        places: [place(10, 37.9, 23.7)],
        deities: [
          { id: 1, name: "Athena", place_ids: [10] },
          { id: 2, name: "Zeus", place_ids: [10] },
        ],
      }),
    )

    expect(map?.markers).toHaveLength(1)
    expect(map?.markers[0]?.subtitle).toBe("Associated with Athena, Zeus")
  })

  it("leaves out a place outside the map's bounds", () => {
    const map = buildCoinMap(
      coin({ deity_id: ["1"] }),
      reference({
        places: [place(10, -33.9, 151.2)],
        deities: [{ id: 1, name: "Athena", place_ids: [10] }],
      }),
    )

    expect(map).toBeNull()
  })

  it("pins an artifact from the coin's supporting images", () => {
    const map = buildCoinMap(
      coin({ flavour_img: ["a1"] }),
      reference({
        places: [place(5, 51.5, -0.12)],
        artifacts: [{ id: "a1", name: "Bust", place_id: "5" }],
      }),
    )

    expect(map?.markers[0]).toMatchObject({ id: "artifact-a1", title: "Bust" })
  })

  it("pins an artifact a deity points at, once even if the coin has it too", () => {
    const map = buildCoinMap(
      coin({
        flavour_img: ["a1"],
        deities: [{ id: 1, name: "Athena", artifact_ids: ["a1"] }],
      } as Partial<CoinEnhanced>),
      reference({
        places: [place(5, 51.5, -0.12)],
        artifacts: [{ id: "a1", name: "Bust", place_id: "5" }],
      }),
    )

    expect(map?.markers).toHaveLength(1)
    expect(map?.markers[0]).toMatchObject({
      id: "artifact-a1",
      title: "Bust",
      lat: 51.5,
    })
  })

  it("uses the timeline map when the coin has a timeline", () => {
    const map = buildCoinMap(
      coin({
        mint_id: 1,
        mint_year_earliest: 200,
        timelines_id: [3],
        found_event: { lat: 51.5, lng: -0.1, notes: null, event_date: "1999" },
      } as Partial<CoinEnhanced>),
      reference({
        mints: [rome],
        timelines: [
          {
            id: 3,
            name: "t",
            timeline: [{ kind: "event", name: "X", year: 193 }],
          },
        ],
      }),
    )

    expect(map?.kind).toBe("timeline")
    if (map?.kind !== "timeline") return
    // The strip draws the mint and find pins itself, so they are not repeated.
    expect(map.markers).toEqual([])
    expect(map.timeline.map((event) => event.kind)).toEqual([
      "event",
      "coin-minted",
      "found",
    ])
  })

  it("falls back to pins when the coin's timeline is not found", () => {
    const map = buildCoinMap(
      coin({ mint_id: 1, timelines_id: [99] }),
      reference({
        mints: [rome],
        timelines: [{ id: 3, name: "t", timeline: [] }],
      }),
    )

    expect(map?.kind).toBe("markers")
  })
})
