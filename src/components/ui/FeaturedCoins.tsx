"use client"

import Link from "next/link"
import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { generateCoinUrl } from "~/lib/utils/url-helpers"

// Shared CSS classes
// min-w-0 lets the coins shrink below their max width on narrow screens, so
// three of them fit the row instead of overflowing and getting clipped.
const COIN_CONTAINER_CLASSES =
  "group max-w-[154px] min-w-0 flex-1 sm:max-w-[252px] lg:max-w-[250px]"
const COIN_IMAGE_CONTAINER_CLASSES =
  "flex aspect-square w-full items-center justify-center"
const LOADING_DOTS_CLASSES = "text-xs text-moonlight/60"

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
          className={`${COIN_IMAGE_CONTAINER_CLASSES} bg-surface-muted animate-pulse rounded-full`}
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
            <div className="bg-surface-muted absolute inset-0 flex animate-pulse items-center justify-center rounded-full">
              <div className={LOADING_DOTS_CLASSES}>...</div>
            </div>
          )}
          <div
            className={`transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <CloudinaryImage
              src={coin.obverseImageId ?? undefined}
              width={280}
              height={280}
              alt={`${coin.civ} ${coin.denomination}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        {displayTextOnHover && (
          <div className="mt-3 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-moonlight-bright text-sm font-medium">
              {coin.nickname}
            </p>
            <p className="text-moonlight text-xs">{coin.denomination}</p>
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
        <h2 className="mb-6 text-center text-2xl font-semibold">{title}</h2>
      )}

      <div className="flex items-center justify-center gap-1 sm:gap-4 lg:gap-6">
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
