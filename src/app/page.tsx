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
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
      <div className="content-wrapper home">
        <PageTitle subtitle="to the Somnus Collection">Welcome</PageTitle>

        {/* Featured Coins Section */}
        {!isLoading && featuredCoins.length === 3 && (
          <div className="w-full max-w-4xl">
            <FeaturedCoins title="" coins={featuredCoins} />
          </div>
        )}

        <div className="text-center">
          <div className="mx-auto max-w-2xl">
            <p className="body-text mb-6 text-xl">
              The Somnus collection is my private collection of ancient coins. I
              started this site while on paternity leave with my first child,
              hence my appeal to the god of sleep (Cloacina would also have been
              appropriate). I love the imagination and stories inspired by
              ancient coins, and learning about the ancient world. I also enjoy
              programming, web design and photography. I aim to combine these
              interests here. I am NOT a historian or photographer so please
              forgive my errors (and let me know if you spot something).
              I&apos;ll try to include references to back up my exaggerations. A
              shoutout to the wonderful Artemis-Collection.com, which inspired
              this site. Please take a look around and share in the curiosity
              and joy of the ancient world. Tim, October 2025.
            </p>
            <p className="body-text mb-6 text-xl">
              My goal for this site is to give each coin the attention it
              deserves. The next big feature I would like to build is a heavily
              interactive map, showing mints, hoard locations and events from
              historical figures lives.
            </p>
            <p className="body-text text-xl">
              Please drop me a note via my contact form if you have any
              questions or notice any historical inaccurracies that I have made.
              I am a fan, not an expert, and love learning new things.
            </p>
          </div>
        </div>

        {/* Featured Sets Section */}
        <div className="w-full max-w-4xl">
          <FeaturedSets sets={featuredSets} />
        </div>
      </div>
    </main>
  )
}
