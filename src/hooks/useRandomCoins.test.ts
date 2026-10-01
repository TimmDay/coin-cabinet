import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import { useRandomCoins } from "./useRandomCoins"

const mockUseSomnusCoins = vi.fn()

vi.mock("~/api/somnus-collection", () => ({
  useSomnusCoins: () => mockUseSomnusCoins() as unknown,
}))

vi.mock("~/data/featured-coins", () => ({
  FEATURED_COIN_IDS: [1, 2, 3],
}))

const coin = (id: number) =>
  ({
    id,
    nickname: `coin ${id}`,
    image_link_o: `img-${id}`,
  }) as SomnusCollection

const withCoins = (ids: number[]) =>
  mockUseSomnusCoins.mockReturnValue({
    data: ids.map(coin),
    isLoading: false,
  })

const pickedIds = () =>
  renderHook(() => useRandomCoins(3)).result.current.coins.map((c) => c.id)

describe("useRandomCoins", () => {
  beforeEach(() => mockUseSomnusCoins.mockReset())

  it("only picks from the featured subset when it has enough coins", () => {
    withCoins([1, 2, 3, 10, 11, 12, 13])
    for (let i = 0; i < 20; i++) {
      expect([...pickedIds()].sort()).toEqual([1, 2, 3])
    }
  })

  it("tops up from other coins when too few featured coins are public", () => {
    withCoins([1, 10, 11, 12])
    const ids = pickedIds()
    expect(ids).toHaveLength(3)
    expect(ids).toContain(1)
    expect(ids.filter((id) => id !== 1).every((id) => id >= 10)).toBe(true)
  })

  it("returns nothing while loading or when there are too few coins", () => {
    mockUseSomnusCoins.mockReturnValue({ data: undefined, isLoading: true })
    expect(pickedIds()).toEqual([])

    withCoins([1, 2])
    expect(pickedIds()).toEqual([])
  })
})
