import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { CoinEnhanced } from "~/types/api"
import { useCoinMap } from "./useCoinMap"

const data = vi.hoisted(() => ({ timelines: undefined as unknown }))

vi.mock("~/api/timelines", () => ({
  useTimelines: () => ({ data: data.timelines }),
}))

const coin = {
  id: 7,
  denomination: "denarius",
  mint_year_earliest: 200,
  timelines_id: [3],
  deities: [
    {
      id: 1,
      name: "Athena",
      places: [{ id: 10, name: "Athens", lat: 37.9, lng: 23.7 }],
      artifacts: [],
      features_coinage: [],
      citations: [],
    },
  ],
} as unknown as CoinEnhanced

const timelines = [
  {
    id: 3,
    name: "t",
    timeline: [{ kind: "event", name: "X", year: 193, sequence: 6 }],
  },
]

describe("useCoinMap", () => {
  beforeEach(() => {
    data.timelines = undefined
  })

  it("pins what comes with the coin, then becomes a timeline map once timelines load", () => {
    const { result, rerender } = renderHook(() => useCoinMap(coin))
    expect(result.current?.kind).toBe("markers")
    expect(result.current?.markers.map((m) => m.id)).toEqual(["deity-place-10"])

    data.timelines = timelines
    rerender()

    expect(result.current?.kind).toBe("timeline")
  })

  it("returns the same map until the coin or the timelines change", () => {
    data.timelines = timelines
    const { result, rerender } = renderHook(() => useCoinMap(coin))
    const first = result.current

    rerender()

    expect(result.current).toBe(first)
  })
})
