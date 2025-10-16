"use client"

import { PageTitle } from "~/components/ui/PageTitle"
import { CoinDeepDive } from "~/components/ui/coin-detail-page"
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
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="coin-description text-xl">Loading coin details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
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
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl text-slate-400">Coin not found</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" data-coin-detail-page>
      <div className="container mx-auto px-4 py-16">
        <div className="mt-8">
          <header className="mb-8 text-center">
            <PageTitle>{coin.nickname ?? "Ancient Coin"}</PageTitle>
          </header>

          {/* Unified Layout: Everything in CoinDeepDive */}
          <CoinDeepDive coin={coin} />
        </div>
      </div>
    </main>
  )
}
