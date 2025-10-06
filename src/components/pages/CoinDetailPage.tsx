"use client"

import CloudinaryImage from "~/components/CloudinaryImage"
import { PageTitle } from "~/components/ui/PageTitle"
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
        <div className="mt-8 text-center">
          <PageTitle className="mb-8">
            {coin.nickname ?? "Ancient Coin"}
          </PageTitle>

          <div className="mb-8 flex justify-center">
            <div className="artemis-card p-8">
              <CloudinaryImage
                src={coin.image_link_o ?? undefined}
                width={300}
                height={300}
                alt={`${coin.nickname ?? "coin"} obverse`}
              />
            </div>
          </div>

          <div className="artemis-card mx-auto max-w-2xl p-6">
            <h2 className="coin-title mb-4 text-xl">Coin Details</h2>
            <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
              <div>
                <span className="text-slate-400">Civilization:</span>
                <span className="ml-2 text-slate-300">{coin.civ}</span>
              </div>
              <div>
                <span className="text-slate-400">Denomination:</span>
                <span className="ml-2 text-slate-300">{coin.denomination}</span>
              </div>
              {coin.mint_year_earliest && (
                <div>
                  <span className="text-slate-400">Year:</span>
                  <span className="ml-2 text-slate-300">
                    {coin.mint_year_earliest}
                    {coin.mint_year_latest &&
                    coin.mint_year_latest !== coin.mint_year_earliest
                      ? `-${coin.mint_year_latest}`
                      : ""}{" "}
                    CE
                  </span>
                </div>
              )}
              {coin.diameter && (
                <div>
                  <span className="text-slate-400">Diameter:</span>
                  <span className="ml-2 text-slate-300">{coin.diameter}mm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
