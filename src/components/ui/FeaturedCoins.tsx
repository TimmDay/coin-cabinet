"use client"

import Link from "next/link"
import CloudinaryImage from "~/components/CloudinaryImage"
import { generateCoinUrl } from "~/lib/utils/url-helpers"

type FeaturedCoin = {
  id: number
  nickname: string
  civ: string
  denomination: string
  mintYearEarliest?: number | null
  mintYearLatest?: number | null
  obverseImageId?: string | null
  reverseImageId?: string | null
  diameter?: number | null
}

type FeaturedCoinsProps = {
  title?: string
  coins: FeaturedCoin[] // Accept any array with 3 coins
  className?: string
}

export function FeaturedCoins({
  title = "Featured Coins",
  coins,
  className = "",
}: FeaturedCoinsProps) {
  // Ensure exactly 3 coins are provided
  if (coins.length !== 3) {
    console.warn("FeaturedCoins component expects exactly 3 coins")
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-300">
          {title}
        </h2>
      )}

      <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        {coins.map((coin) => {
          const coinUrl = generateCoinUrl(coin.id, coin.nickname)

          return (
            <Link
              key={coin.id}
              href={coinUrl}
              className="group max-w-[150px] flex-1 transition-transform hover:scale-105 sm:max-w-[180px] lg:max-w-[200px]"
            >
              <div className="flex flex-col items-center">
                <div className="flex aspect-square w-full items-center justify-center">
                  <CloudinaryImage
                    src={coin.obverseImageId ?? undefined}
                    width={200}
                    height={200}
                    alt={`${coin.civ} ${coin.denomination}`}
                  />
                </div>
                <div className="mt-3 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium text-slate-300">
                    {coin.nickname}
                  </p>
                  <p className="text-xs text-slate-400">{coin.denomination}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
