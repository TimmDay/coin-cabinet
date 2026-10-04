import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { CoinEnhanced } from "~/types/api"
import { useCoinMap } from "./useCoinMap"

const data = vi.hoisted(() => ({ mints: undefined as unknown }))

vi.mock("~/api/mints", () => ({ useMints: () => ({ data: data.mints }) }))
vi.mock("~/api/timelines", () => ({ useTimelines: () => ({}) }))
vi.mock("~/api/deities", () => ({ useDeities: () => ({}) }))
vi.mock("~/api/artifacts", () => ({ useArtifacts: () => ({}) }))
vi.mock("~/api/places", () => ({ usePlaces: () => ({}) }))

const coin = {
  id: 7,
  denomination: "denarius",
  mint_id: 1,
} as CoinEnhanced

describe("useCoinMap", () => {
  beforeEach(() => {
    data.mints = undefined
  })

  it("is null while the reference data loads, then fills in", () => {
    const { result, rerender } = renderHook(() => useCoinMap(coin))
    expect(result.current).toBeNull()

    data.mints = [{ id: 1, name: "Rome mint", lat: 41.9, lng: 12.5 }]
    rerender()

    expect(result.current?.markers.map((m) => m.id)).toEqual(["coin-mint-7"])
  })

  it("returns the same map until the coin or its data changes", () => {
    data.mints = [{ id: 1, name: "Rome mint", lat: 41.9, lng: 12.5 }]
    const { result, rerender } = renderHook(() => useCoinMap(coin))
    const first = result.current

    rerender()

    expect(result.current).toBe(first)
  })
})
