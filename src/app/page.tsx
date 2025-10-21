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
          <p className="body-text mb-6 text-xl">
            The Somnus collection is where I display my private collection of
            ancient coins. Combining my interests in programming, web design,
            writing and ancient coins - I seek to share stories about each coin
            as I learn. Inspired by the Artemis-Collection.com, I created this
            website in October of 2025.
          </p>
          <p className="body-text mb-6 text-xl">
            My goal for this site is to give each coin the attention it
            deserves. The next big feature I would like to build is a heavily
            interactive map, showing mints, hoard locations and events from
            historical figures lives.
          </p>
          <p className="body-text text-xl">
            Please drop me a note via my contact form if you have any questions
            or notice any historical inaccurracies that I have made. I am a fan,
            not an expert, and love learning new things!
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
