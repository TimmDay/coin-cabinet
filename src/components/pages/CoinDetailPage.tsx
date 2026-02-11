"use client"

import { RelatedPosts } from "~/components/RelatedPosts"
import { CoinDeepDive } from "~/components/ui/coin-deep-dive"
import { NotFound404 } from "~/components/ui/NotFound404"
import { PageTitle } from "~/components/ui/PageTitle"
import { useSpecificCoinData } from "~/hooks/useEnhancedCoinData"

type CoinDetailPageProps = {
  coinId: string
}

export function CoinDetailPage({ coinId }: CoinDetailPageProps) {
  const { coin, isLoading, error } = useSpecificCoinData(parseInt(coinId))

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
            message="The requested coin could not be found. It may have been removed or is not currently visible."
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
          <header className="mb-4 md:mb-6">
            <PageTitle subtitle={coin.denomination} coin={coin}>
              {coin.nickname ?? "Ancient Coin"}
            </PageTitle>
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
