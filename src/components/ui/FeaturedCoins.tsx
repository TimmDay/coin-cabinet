"use client"

import Link from "next/link"
import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { generateCoinUrl } from "~/lib/utils/url-helpers"

// Shared CSS classes
const COIN_CONTAINER_CLASSES =
  "group max-w-[150px] flex-1 sm:max-w-[180px] lg:max-w-[200px]"
const COIN_IMAGE_CONTAINER_CLASSES =
  "flex aspect-square min-h-[120px] w-full items-center justify-center sm:min-h-[150px] lg:min-h-[180px]"
const LOADING_DOTS_CLASSES = "text-xs text-slate-800"

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
  coins?: FeaturedCoin[] // Accept any array with 3 coins
  className?: string
  displayTextOnHover?: boolean
  isLoading?: boolean
}

function FeaturedCoinSkeleton() {
  return (
    <div className={COIN_CONTAINER_CLASSES}>
      <div className="flex flex-col items-center">
        <div
          className={`${COIN_IMAGE_CONTAINER_CLASSES} animate-pulse rounded-full bg-slate-800/50`}
        >
          <div className={LOADING_DOTS_CLASSES}>...</div>
        </div>
      </div>
    </div>
  )
}

function FeaturedCoinImage({
  coin,
  displayTextOnHover,
}: {
  coin: FeaturedCoin
  displayTextOnHover: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link
      href={generateCoinUrl(coin.id, coin.nickname)}
      className={`${COIN_CONTAINER_CLASSES} transition-transform hover:scale-105`}
    >
      <div className="flex flex-col items-center">
        <div className={`relative ${COIN_IMAGE_CONTAINER_CLASSES}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-full bg-slate-800/50">
              <div className={LOADING_DOTS_CLASSES}>...</div>
            </div>
          )}
          <div
            className={`transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <CloudinaryImage
              src={coin.obverseImageId ?? undefined}
              width={200}
              height={200}
              alt={`${coin.civ} ${coin.denomination}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        {displayTextOnHover && (
          <div className="mt-3 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-sm font-medium text-slate-300">
              {coin.nickname}
            </p>
            <p className="text-xs text-slate-400">{coin.denomination}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

export function FeaturedCoins({
  title = "Featured Coins",
  coins = [],
  className = "",
  displayTextOnHover = false,
  isLoading = false,
}: FeaturedCoinsProps) {
  const shouldShowLoading = isLoading || coins.length !== 3

  if (!isLoading && coins.length > 0 && coins.length !== 3) {
    console.warn("FeaturedCoins component expects exactly 3 coins")
  }

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-300">
          {title}
        </h2>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
        {shouldShowLoading
          ? Array.from({ length: 3 }, (_, i) => (
              <FeaturedCoinSkeleton key={i} />
            ))
          : coins.map((coin) => (
              <FeaturedCoinImage
                key={coin.id}
                coin={coin}
                displayTextOnHover={displayTextOnHover}
              />
            ))}
      </div>
    </div>
  )
}
