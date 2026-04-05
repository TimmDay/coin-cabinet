"use client"

import { useMemo } from "react"
import { useSomnusCoins } from "~/api/somnus-collection"
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

    const shuffled = [...coinsWithImages].sort(() => Math.random() - 0.5)

    return shuffled.slice(0, count).map((coin) => ({
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
