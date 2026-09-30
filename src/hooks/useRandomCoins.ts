"use client"

import { useMemo } from "react"
import { useSomnusCoins } from "~/api/somnus-collection"
import { FEATURED_COIN_IDS } from "~/data/featured-coins"
import type { SomnusCollection } from "~/database/schema-somnus-collection"

type RandomCoin = {
  id: number
  nickname: string
  civ: string
  denomination: string
  mintYearEarliest?: number | null
  mintYearLatest?: number | null
  obverseImageId?: string | null
  reverseImageId?: string | null
  diameter?: number | null
}

/** Fisher-Yates shuffle. (Sorting with a random comparator is biased.) */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

/**
 * Picks `count` random coins for the homepage, from the chosen subset in
 * `FEATURED_COIN_IDS`. If fewer than `count` of those are currently public,
 * the rest are topped up from the other public coins, so the widget never
 * gets stuck on its loading skeleton.
 */
export function useRandomCoins(count = 3): {
  coins: RandomCoin[]
  isLoading: boolean
} {
  const {
    data: coinsWithImages,
    isLoading,
  }: {
    data: SomnusCollection[] | undefined
    isLoading: boolean
  } = useSomnusCoins()

  const coins = useMemo(() => {
    if (!coinsWithImages) return []
    if (coinsWithImages.length < count) return []

    const featured = coinsWithImages.filter((coin) =>
      FEATURED_COIN_IDS.includes(coin.id),
    )
    const others = coinsWithImages.filter(
      (coin) => !FEATURED_COIN_IDS.includes(coin.id),
    )
    const picked = [...shuffle(featured), ...shuffle(others)].slice(0, count)

    return picked.map((coin) => ({
      id: coin.id,
      nickname: coin.nickname,
      civ: coin.civ,
      denomination: coin.denomination,
      mintYearEarliest: coin.mint_year_earliest,
      mintYearLatest: coin.mint_year_latest,
      obverseImageId: coin.image_link_o,
      reverseImageId: coin.image_link_r,
      diameter: coin.diameter,
    }))
  }, [count, coinsWithImages])

  return {
    coins,
    isLoading,
  }
}
