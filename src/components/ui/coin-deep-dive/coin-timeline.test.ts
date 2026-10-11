import { describe, expect, it } from "vitest"
import type { Event } from "~/data/timelines/types"
import type { Mint } from "~/database/schema-mints"
import type { Timeline } from "~/database/schema-timelines"
import type { CoinEnhanced } from "~/types/api"
import { coinTimeline } from "./coin-timeline"

const ev = (name: string, year: number, sequence = 6): Event => ({
  kind: "political",
  name,
  year,
  sequence,
})

const timelines = (...events: Event[]): Timeline[] => [
  {
    id: 3,
    name: "t",
    timeline: events,
    created_at: "",
    updated_at: "",
    user_id: "",
  },
]

const coin = (overrides: Partial<CoinEnhanced> = {}) =>
  ({
    id: 7,
    denomination: "denarius",
    timelines_id: [3],
    mint_year_earliest: 200,
    ...overrides,
  }) as CoinEnhanced

const rome = { id: 1, name: "Rome", lat: 41.9, lng: 12.5 } as Mint

const names = (timeline: Event[] | null) => timeline?.map((e) => e.name)

describe("coinTimeline", () => {
  it("places the coin between two events whose years straddle it", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: 150 }),
      timelines(ev("A", 100), ev("B", 200), ev("C", 300)),
    )
    expect(names(timeline)).toEqual(["A", "Coin Minted", "B", "C"])
  })

  it("places the coin at number 6 within its year", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: 200 }),
      timelines(ev("Early", 200, 2), ev("Late", 200, 9)),
    )
    expect(names(timeline)).toEqual(["Early", "Coin Minted", "Late"])
  })

  it("puts the coin after events that share its number", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: 200 }),
      timelines(
        ev("Same", 200, 6),
        ev("Between", 200, 6.01),
        ev("Next", 200, 7),
      ),
    )
    expect(names(timeline)).toEqual(["Same", "Coin Minted", "Between", "Next"])
  })

  it("puts the coin first when it predates every event", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: 50 }),
      timelines(ev("A", 100), ev("B", 200)),
    )
    expect(names(timeline)).toEqual(["Coin Minted", "A", "B"])
  })

  it("puts the find last", () => {
    const timeline = coinTimeline(
      coin({
        mint_year_earliest: 150,
        found_event: { lat: 51.5, lng: -0.1, notes: null, event_date: "1999" },
      } as Partial<CoinEnhanced>),
      timelines(ev("A", 100), ev("B", 200)),
    )
    expect(timeline?.map((e) => e.kind)).toEqual([
      "political",
      "coin-minted",
      "political",
      "found",
    ])
  })

  it("adds no minting event to a coin without a year", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: null }),
      timelines(ev("A", 100), ev("B", 200)),
    )
    expect(names(timeline)).toEqual(["A", "B"])
  })

  it("places a coin of 1 BC before one of AD 1", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: -1, mint_year_latest: -1 }),
      timelines(ev("Before", -5), ev("After", 1)),
    )
    expect(names(timeline)).toEqual(["Before", "Coin Minted", "After"])
  })

  // There is no year zero (1 BC is followed by AD 1), so a 0 is no year
  it("adds no minting event to a coin dated 0", () => {
    const timeline = coinTimeline(
      coin({ mint_year_earliest: 0 }),
      timelines(ev("Before", -5), ev("After", 5)),
    )
    expect(names(timeline)).toEqual(["Before", "After"])
  })

  it("names the mint and the years the coin was struck in", () => {
    const timeline = coinTimeline(
      coin({ mint: rome, mint_year_earliest: 193, mint_year_latest: 211 }),
      timelines(ev("A", 100)),
    )
    expect(timeline?.find((e) => e.kind === "coin-minted")).toMatchObject({
      year: 193,
      place: "Rome",
      lat: 41.9,
      lng: 12.5,
      description: "This denarius was minted at Rome approximately 193 to 211",
    })
  })

  it("does not change the timeline it is given", () => {
    const given = timelines(ev("B", 200), ev("A", 100))
    coinTimeline(coin({ mint_year_earliest: 150 }), given)
    expect(names(given[0]!.timeline)).toEqual(["B", "A"])
  })

  it("is null when the coin has no timeline", () => {
    expect(coinTimeline(coin({ timelines_id: [99] }), timelines())).toBeNull()
    expect(coinTimeline(coin(), undefined)).toBeNull()
  })
})
