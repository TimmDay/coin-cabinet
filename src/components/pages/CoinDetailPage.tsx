"use client"

import { EmbeddedCaracallaGettaBlog } from "~/components/EmbeddedCaracallaGettaBlog"
import { PageTitleWithSnapshot } from "~/components/ui/PageTitleWithSnapshot"
import { CoinDeepDive } from "~/components/ui/coin-deep-dive"
import { CoinSnapshot } from "~/components/ui/coin-deep-dive/CoinSnapshot"
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

  // Check if this coin is related to Caracalla
  const isCaracallaCoin =
    coin.nickname?.toLowerCase().includes("caracalla") ||
    coin.authority?.toLowerCase().includes("caracalla")

  return (
    <main className="min-h-screen" data-coin-detail-page>
      <div className="container mx-auto px-4 py-16">
        <div className="mt-8">
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

          {/* Show Caracalla and Geta blog post for Caracalla coins */}
          {isCaracallaCoin && <EmbeddedCaracallaGettaBlog />}
        </div>
      </div>
    </main>
  )
}
