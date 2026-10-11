import { describe, expect, it } from "vitest"
import type { Mint } from "~/database/schema-mints"
import type { CoinDeity, CoinEnhanced } from "~/types/api"
import {
  buildCoinMap,
  selectedYearForCoin,
  type CoinMapReference,
} from "./coinMap"

const coin = (overrides: Partial<CoinEnhanced> = {}) =>
  ({
    id: 7,
    nickname: "Test",
    denomination: "denarius",
    ...overrides,
  }) as CoinEnhanced

const rome = { id: 1, name: "Rome mint", lat: 41.9, lng: 12.5 } as Mint
const deity = (id: number, name: string, over: Partial<CoinDeity> = {}) =>
  ({ id, name, place_ids: [], artifact_ids: [], ...over }) as CoinDeity
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
      buildCoinMap(coin({ mint_id: 1, mint: null }), reference()),
    ).toBeNull()
  })

  it("pins where a coin was struck, with the year", () => {
    const map = buildCoinMap(
      coin({ mint: rome, mint_year_earliest: 200 }),
      reference(),
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
        mint: rome,
        found_event: {
          lat: 51.5,
          lng: -0.1,
          notes: "A field",
          event_date: "1999",
        },
      }),
      reference(),
    )

    expect(map?.markers.map((m) => m.id)).toEqual([
      "coin-mint-7",
      "coin-found-7",
    ])
  })

  it("leaves out a mint or find with unusable coordinates, and keeps a zero", () => {
    const equator = { id: 2, name: "Equator mint", lat: 20, lng: 0 } as Mint
    const map = buildCoinMap(
      coin({
        mint: equator,
        found_event: { lat: Number.NaN, lng: 3, notes: null, event_date: "1" },
      }),
      reference(),
    )

    expect(map?.markers.map((m) => m.id)).toEqual(["coin-mint-7"])
    expect(
      buildCoinMap(
        coin({ mint: { ...rome, id: 3, lat: Number.NaN } }),
        reference(),
      ),
    ).toBeNull()
  })

  it("pins a deity's places, naming every deity that shares one", () => {
    const map = buildCoinMap(
      coin({
        deities: [
          deity(1, "Athena", { place_ids: [10] }),
          deity(2, "Zeus", { place_ids: [10] }),
        ],
      }),
      reference({ places: [place(10, 37.9, 23.7)] }),
    )

    expect(map?.markers).toHaveLength(1)
    expect(map?.markers[0]?.subtitle).toBe("Associated with Athena, Zeus")
  })

  it("leaves out a place outside the map's bounds", () => {
    const map = buildCoinMap(
      coin({ deities: [deity(1, "Athena", { place_ids: [10] })] }),
      reference({ places: [place(10, -33.9, 151.2)] }),
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
        deities: [deity(1, "Athena", { artifact_ids: ["a1"] })],
      }),
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
        mint: rome,
        mint_year_earliest: 200,
        timelines_id: [3],
        found_event: { lat: 51.5, lng: -0.1, notes: null, event_date: "1999" },
      } as Partial<CoinEnhanced>),
      reference({
        timelines: [
          {
            id: 3,
            name: "t",
            timeline: [{ kind: "event", name: "X", year: 193, sequence: 6 }],
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
      coin({ mint: rome, timelines_id: [99] }),
      reference({
        timelines: [{ id: 3, name: "t", timeline: [] }],
      }),
    )

    expect(map?.kind).toBe("markers")
  })
})

describe("selectedYearForCoin", () => {
  it("uses the coin's earliest minting year", () => {
    expect(selectedYearForCoin({ mint_year_earliest: 117 })).toBe(117)
  })

  it("collapses a range to its earliest year", () => {
    expect(
      selectedYearForCoin({ mint_year_earliest: 193, mint_year_latest: 211 }),
    ).toBe(193)
  })

  it("keeps BC years negative rather than treating them as missing", () => {
    expect(selectedYearForCoin({ mint_year_earliest: -44 })).toBe(-44)
  })

  // A coin struck in AD 1 must not be mistaken for a coin with no date.
  it("treats year zero as a real year", () => {
    expect(selectedYearForCoin({ mint_year_earliest: 0 })).toBe(0)
  })

  it.each([[null], [undefined]])(
    "gives no year, and so no Jurisdiction layer, for %s",
    (value) => {
      expect(selectedYearForCoin({ mint_year_earliest: value })).toBeNull()
    },
  )
})
