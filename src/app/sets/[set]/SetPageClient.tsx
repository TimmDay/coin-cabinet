"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { useAllSomnusCoins } from "~/lib/api/somnus-collection"
import { generateSetCoinUrl } from "~/lib/utils/url-helpers"

type SetInfo = {
  title: string
  description: string
  setFilter: string
}

type SetPageClientProps = {
  setInfo: SetInfo
  setSlug: string
  viewMode: "obverse" | "reverse" | "both"
}

export function SetPageClient({
  setInfo,
  setSlug,
  viewMode,
}: SetPageClientProps) {
  const router = useRouter()

  // Fetch all coins using React Query (shared with coin-cabinet page)
  const { data: allCoins, isLoading, error } = useAllSomnusCoins()

  // Filter coins for this specific set
  const coins = useMemo(() => {
    if (!allCoins) return []
    return allCoins.filter(
      (coin) => coin.sets?.includes(setInfo.setFilter) ?? false,
    )
  }, [allCoins, setInfo.setFilter])

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-x-12">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="group w-fit cursor-pointer text-center">
            <div className="flex justify-center gap-2">
              <div className="flex h-[200px] w-[200px] flex-shrink-0 items-center justify-center">
                <div className="h-[200px] w-[200px] animate-pulse rounded bg-slate-800/20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-400">
          Error loading coins:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    )
  }

  return (
    <>
      {coins.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-slate-400">
            No coins found in the {setInfo.title} set.
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
