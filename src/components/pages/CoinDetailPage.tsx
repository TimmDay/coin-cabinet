"use client"

import { RelatedPosts } from "~/components/RelatedPosts"
import { CoinDeepDive } from "~/components/ui/coin-deep-dive"
import { CoinSnapshot } from "~/components/ui/coin-deep-dive/CoinSnapshot"
import { NotFound404 } from "~/components/ui/NotFound404"
import { PageTitleWithSnapshot } from "~/components/ui/PageTitleWithSnapshot"
import { useSomnusCoins } from "~/lib/api/somnus-collection"

type CoinDetailPageProps = {
  coinId: string
}

export function CoinDetailPage({ coinId }: CoinDetailPageProps) {
  const { data: coins, isLoading, error } = useSomnusCoins()

  // Find the specific coin by ID
  const coin = coins?.find((c) => c.id?.toString() === coinId)

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
        <div className="content-wrapper">
          <div className="text-center">
            <p className="coin-description text-xl">Loading coin details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
        <div className="content-wrapper">
          <div className="text-center">
            <p className="text-xl text-red-400">
              Error loading coin:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!coin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
        <div className="content-wrapper">
          <NotFound404
            title="Coin not found"
            message="The requested coin could not be found"
            fullScreen={false}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden">
      <div className="content-wrapper">
        <div>
          <header className="mb-8">
            <PageTitleWithSnapshot
              coinSnapshot={
                <CoinSnapshot
                  civ={coin.civ}
                  civSpecific={coin.civ_specific}
                  mint={coin.mint}
                  mintYearEarliest={coin.mint_year_earliest}
                  mintYearLatest={coin.mint_year_latest}
                  diameter={coin.diameter}
                  mass={coin.mass}
                  dieAxis={coin.die_axis}
                  reference={coin.reference}
                  provenance={coin.provenance}
                />
              }
              subtitle={coin.denomination}
            >
              {coin.nickname ?? "Ancient Coin"}
            </PageTitleWithSnapshot>
          </header>

          {/* Unified Layout: Everything in CoinDeepDive */}
          <CoinDeepDive coin={coin} />

          {/* Related blog posts based on coin characteristics */}
          <RelatedPosts nickname={coin.nickname} />
        </div>
      </div>
    </main>
  )
}
