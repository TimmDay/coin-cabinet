"use client"

import { useMemo } from "react"
import { useAllSomnusCoins } from "~/api/somnus-collection"
import { FeaturedCoins } from "~/components/ui/FeaturedCoins"
import { FeaturedSets } from "~/components/ui/FeaturedSets"
import { PageTitle } from "~/components/ui/PageTitle"
import { featuredSets } from "~/data/sets"

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
              This site is dedicated to my collection of ancient coins. I
              started it while on paternity leave with my first child, hence my
              appeal to the god of sleep (Cloacina would also have been
              appropriate). I love the imagination and stories that ancient
              coins inspire. In a way, they scratch my travel itch without the
              travel, and makes tangible the feeling that we are all just part
              of a long long line of human beings living with occasionally
              nutjob leadership. I am NOT a historian or photographer so please
              forgive my errors (and do let me know if you spot something).
              Enjoy taking a look around and sharing in the curiosity!
            </p>
            <p className="body-text mb-6 text-xl">
              A shoutout to the wonderful Artemis-Collection.com, which inspired
              this site.
            </p>
          </div>
        </div>

        {/* Featured Sets Section */}
        <div className="w-full max-w-4xl">
          <FeaturedSets sets={featuredSets} />
        </div>
        <div>
          <p className="body-text text-xl">
            Again I am a fan, not an expert, and I love learning new things. I
            appreciate any insights from enthusiasts!
          </p>
          {/* \TODO: contact form */}
        </div>
      </div>
    </main>
  )
}
