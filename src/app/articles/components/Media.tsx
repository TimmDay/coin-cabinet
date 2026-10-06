"use client"

import { useEffect, useMemo, useState } from "react"
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

  // The candidates, in a stable order. Choosing happens below, on the client:
  // shuffling during render would give the server a different three coins
  // from the browser and the markup would not match at hydration.
  const candidates = useMemo(() => {
    if (!allCoins) return []

    // Filter coins that have obverse images
    const coinsWithImages = allCoins.filter(
      (coin) => coin.image_link_o && coin.image_link_o.trim() !== "",
    )

    if (coinsWithImages.length < 3) return []

    return coinsWithImages.map((coin) => ({
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

  // Three of them, picked once per visit. Client only, for the reason above.
  const [featuredCoins, setFeaturedCoins] = useState<typeof candidates>([])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (candidates.length < 3) {
      setFeaturedCoins([])
      return
    }
    const shuffled = [...candidates].sort(() => Math.random() - 0.5)
    setFeaturedCoins(shuffled.slice(0, 3))
  }, [candidates])
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <FeaturedCoins
      title={title}
      coins={featuredCoins}
      isLoading={isLoading}
      className={`mb-4 ${className}`}
    />
  )
}
