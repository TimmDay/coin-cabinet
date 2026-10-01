"use client"

import { useMemo } from "react"
import { useSomnusCoins } from "../../../api/somnus-collection"
import { FeaturedCoins } from "../../../components/ui/FeaturedCoins"

/**
 * FeaturedCoinsWithData - Client-side wrapper that fetches coin data
 * Usage:
 * <FeaturedCoinsWithData />
 * <FeaturedCoinsWithData title="Custom Title" />
 */
type FeaturedCoinsWithDataProps = {
  title?: string
  className?: string
}

export function FeaturedCoinsWithData({
  title = "Featured Coins from the Collection",
  className = "",
}: FeaturedCoinsWithDataProps) {
  const { data: allCoins, isLoading } = useSomnusCoins()

  // Randomly select 3 coins with images
  const featuredCoins = useMemo(() => {
    if (!allCoins) return []

    // Filter coins that have obverse images
    const coinsWithImages = allCoins.filter(
      (coin) => coin.image_link_o && coin.image_link_o.trim() !== "",
    )

    if (coinsWithImages.length < 3) return []

    // Shuffle array and take first 3 (randomize on each render)
    const shuffled = [...coinsWithImages].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3).map((coin) => ({
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
  }, [allCoins])

  return (
    <FeaturedCoins
      title={title}
      coins={featuredCoins}
      isLoading={isLoading}
      className={`mb-4 ${className}`}
    />
  )
}
