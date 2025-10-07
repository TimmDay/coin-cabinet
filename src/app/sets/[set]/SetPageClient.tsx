"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { ViewModeControls } from "~/components/ui/ViewModeControls"
import { generateSetCoinUrl } from "~/lib/utils/url-helpers"
import type { SomnusCollection } from "~/server/db/schema"

type SetPageClientProps = {
  allCoins: SomnusCollection[]
  setFilter: string
  setSlug: string
  setTitle: string
}

export function SetPageClient({
  allCoins,
  setFilter,
  setSlug,
  setTitle,
}: SetPageClientProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"obverse" | "reverse" | "both">(
    "obverse",
  )

  // Filter coins client-side
  const coins = allCoins.filter((coin) => {
    return coin.sets?.includes(setFilter) ?? false
  })

  return (
    <>
      <ViewModeControls viewMode={viewMode} onViewModeChange={setViewMode} />

      {coins.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-slate-400">
            No coins found in the {setTitle} set.
          </p>
        </div>
      ) : (
        // TODO: set specific layout components
        <div className="flex flex-wrap justify-center gap-x-12">
          {coins.map((coin, index) => (
            <CoinCardGridItem
              key={coin.id}
              civ={coin.civ}
              nickname={coin.nickname}
              denomination={coin.denomination}
              mintYearEarliest={coin.mint_year_earliest}
              mintYearLatest={coin.mint_year_latest}
              obverseImageId={coin.image_link_o}
              reverseImageId={coin.image_link_r}
              diameter={coin.diameter}
              view={viewMode}
              onClick={() => {
                const url = generateSetCoinUrl(setSlug, coin.id, coin.nickname)
                router.push(url)
              }}
              index={index + 1}
            />
          ))}
        </div>
      )}
    </>
  )
}
