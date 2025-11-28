"use client"

import { useMemo } from "react"
import { useAllSomnusCoins } from "~/api/somnus-collection"
import { FeaturedCoins } from "../ui/FeaturedCoins"

// Client-side wrapper for FeaturedCoins to use in MDX with real coin data
export function MDXFeaturedCoins() {
  const { data: allCoins, isLoading } = useAllSomnusCoins()

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

  // Show loading state or return null if no coins available
  if (isLoading || featuredCoins.length < 3) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-slate-400">
          {isLoading ? "Loading featured coins..." : "No coins available"}
        </div>
      </div>
    )
  }

  return (
    <FeaturedCoins
      coins={featuredCoins}
      title="Featured Coins from the Collection"
    />
  )
}
