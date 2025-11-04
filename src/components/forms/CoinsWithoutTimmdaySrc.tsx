"use client"

import { useAllSomnusCoins } from "~/lib/api/somnus-collection"
import { generateImageId } from "~/lib/utils/image-id-generation"

type CoinData = {
  id: number
  nickname: string
  denomination: string
  purchase_date: string | null
  purchase_vendor: string | null
  image_link_o: string | null
  image_link_r: string | null
}

function generateObverseImageId(coin: CoinData): string {
  const generatedId = generateImageId(
    coin.nickname ?? "",
    coin.denomination ?? "",
    coin.purchase_date ?? "",
    coin.purchase_vendor ?? "",
    "o",
  )

  return generatedId ?? "Missing data for generation"
}

export function CoinsWithoutTimmdaySrc() {
  const { data: coins, isLoading, error } = useAllSomnusCoins()

  if (isLoading) {
    return (
      <div className="somnus-card p-6">
        <h3 className="text-auth-accent mb-4 text-xl font-semibold">
          Coins Without Timmday src
        </h3>
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="somnus-card p-6">
        <h3 className="text-auth-accent mb-4 text-xl font-semibold">
          Coins Without Timmday src
        </h3>
        <p className="text-sm text-red-400">Error loading coins</p>
      </div>
    )
  }

  // Filter coins that have images but don't contain "src-timmday" in either obverse or reverse links
  const coinsWithoutTimmdaySrc =
    coins?.filter((coin) => {
      const hasObverse = coin.image_link_o && coin.image_link_o.trim() !== ""
      const hasReverse = coin.image_link_r && coin.image_link_r.trim() !== ""

      // Only consider coins that have at least one image
      if (!hasObverse && !hasReverse) return false

      const obverseLacksTimmdaySrc =
        hasObverse && !coin.image_link_o?.includes("src-timmday")
      const reverseLacksTimmdaySrc =
        hasReverse && !coin.image_link_r?.includes("src-timmday")

      // Return true if coin has images but at least one doesn't include "src-timmday"
      return Boolean(obverseLacksTimmdaySrc) || Boolean(reverseLacksTimmdaySrc)
    }) ?? []

  // Debug: log the filtering results
  console.log("All coins:", coins?.length)
  console.log("Coins without timmday src:", coinsWithoutTimmdaySrc.length)
  console.log(
    "Coins missing timmday src:",
    coinsWithoutTimmdaySrc.map((coin) => ({
      nickname: coin.nickname,
      obverse: coin.image_link_o,
      reverse: coin.image_link_r,
    })),
  )

  if (coinsWithoutTimmdaySrc.length === 0) {
    return (
      <div className="somnus-card p-6">
        <h3 className="text-auth-accent mb-4 text-xl font-semibold">
          Coins Without Timmday src
        </h3>
        <p className="text-sm text-slate-400">All coins have timmday src! 🎉</p>
      </div>
    )
  }

  return (
    <div className="somnus-card p-6">
      <h3 className="text-auth-accent mb-4 text-xl font-semibold">
        Coins Without Timmday src
      </h3>
      <p className="coin-description mb-4 text-sm">
        These coins have images but are missing &ldquo;src-timmday&rdquo; in
        their image links:
      </p>
      <div className="max-h-80 space-y-3 overflow-y-auto">
        {coinsWithoutTimmdaySrc.map((coin) => (
          <div key={coin.id} className="space-y-1">
            <div className="text-sm text-slate-300">
              {coin.nickname} {coin.denomination} - {coin.purchase_date}
            </div>
            <div className="pl-2 font-mono text-xs text-slate-500">
              {generateObverseImageId(coin)}
            </div>
            <div className="pl-2 text-xs text-slate-400">
              O:{" "}
              {coin.image_link_o
                ? coin.image_link_o.includes("src-timmday")
                  ? "✓"
                  : "✗"
                : "N/A"}{" "}
              | R:{" "}
              {coin.image_link_r
                ? coin.image_link_r.includes("src-timmday")
                  ? "✓"
                  : "✗"
                : "N/A"}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Total: {coinsWithoutTimmdaySrc.length} coin
        {coinsWithoutTimmdaySrc.length !== 1 ? "s" : ""}
      </p>
    </div>
  )
}
