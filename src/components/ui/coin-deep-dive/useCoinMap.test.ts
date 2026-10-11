import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { CoinEnhanced } from "~/types/api"
import { useCoinMap } from "./useCoinMap"

const data = vi.hoisted(() => ({ places: undefined as unknown }))

vi.mock("~/api/timelines", () => ({ useTimelines: () => ({}) }))
vi.mock("~/api/artifacts", () => ({ useArtifacts: () => ({}) }))
vi.mock("~/api/places", () => ({ usePlaces: () => ({ data: data.places }) }))

const coin = {
  id: 7,
  denomination: "denarius",
  deities: [
    {
      id: 1,
      name: "Athena",
      place_ids: [10],
      artifact_ids: [],
      features_coinage: [],
      citations: [],
    },
  ],
} as unknown as CoinEnhanced

const athens = [{ id: 10, name: "Athens", lat: 37.9, lng: 23.7 }]

describe("useCoinMap", () => {
  beforeEach(() => {
    data.places = undefined
  })

  it("is null while the reference data loads, then fills in", () => {
    const { result, rerender } = renderHook(() => useCoinMap(coin))
    expect(result.current).toBeNull()

    data.places = athens
    rerender()

    expect(result.current?.markers.map((m) => m.id)).toEqual(["deity-place-10"])
  })

  it("returns the same map until the coin or its data changes", () => {
    data.places = athens
    const { result, rerender } = renderHook(() => useCoinMap(coin))
    const first = result.current

    rerender()

    expect(result.current).toBe(first)
  })
})
