"use client"

import { useMemo } from "react"
import { FeaturedCoins } from "~/components/ui/FeaturedCoins"
import { FeaturedSets } from "~/components/ui/FeaturedSets"
import { PageTitle } from "~/components/ui/PageTitle"
import { useAllSomnusCoins } from "~/lib/api/somnus-collection"
import { featuredSets } from "~/lib/constants/sets"

export default function HomePage() {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <PageTitle subtitle="to the Somnus Collection">Welcome</PageTitle>

        {/* Featured Coins Section */}
        {!isLoading && featuredCoins.length === 3 && (
          <div className="w-full max-w-4xl">
            <FeaturedCoins title="" coins={featuredCoins} />
          </div>
        )}

        <div className="text-center">
          <p className="body-text text-xl">
            The Somnus collection is a site dedicated to my personal collection
            of ancient coins.
          </p>
        </div>

        {/* Featured Sets Section */}
        <div className="w-full max-w-4xl">
          <FeaturedSets sets={featuredSets} />
        </div>
      </div>
    </main>
  )
}
