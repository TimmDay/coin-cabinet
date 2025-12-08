"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSomnusCoins } from "~/api/somnus-collection"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { BrowseCoinsModal } from "~/components/ui/BrowseCoinsModal"
import {
  ViewModeControls,
  type ClickMode,
} from "~/components/ui/ViewModeControls"
import { generateCoinUrl } from "~/lib/utils/url-helpers"

type CoinGridProps = {
  filterSet?: string
  filterCiv?: string
}

export function CoinGrid({ filterSet, filterCiv }: CoinGridProps = {}) {
  const router = useRouter()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    currentIndex: number
    focusTarget: "previous" | "next" | null
  }>({ isOpen: false, currentIndex: 0, focusTarget: null })

  const [viewMode, setViewMode] = useState<"obverse" | "reverse" | "both">(
    "obverse",
  )

  const [clickMode, setClickMode] = useState<ClickMode>("dive")

  // Fetch coins from database (already filtered for obverse images at DB level)
  const { data: coins, isLoading, error } = useSomnusCoins()

  // Filter coins by set and/or civilization, then sort by mint_year_earliest
  const filteredCoins = (coins ?? [])
    .filter((coin) => {
      let matchesSet = true
      let matchesCiv = true

      if (filterSet) {
        matchesSet = coin.sets?.includes(filterSet) ?? false
      }

      if (filterCiv) {
        matchesCiv = coin.civ === filterCiv
      }

      return matchesSet && matchesCiv
    })
    .sort((a, b) => {
      // Special sorting for "gordy boys" set
      if (filterSet === "gordy boys") {
        const denomA = a.denomination?.toLowerCase() ?? ""
        const denomB = b.denomination?.toLowerCase() ?? ""

        // Priority order: denarius first, then antoninianus, then sestertius, then by mint year
        const getPriority = (denom: string) => {
          if (denom === "denarius") return 1
          if (denom === "antoninianus") return 2
          if (denom === "sestertius") return 3
          return 4
        }

        const priorityA = getPriority(denomA)
        const priorityB = getPriority(denomB)

        // If different priorities, sort by priority
        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }

        // If same priority (including both being "other"), sort by mint year
        const yearA = a.mint_year_earliest ?? 0
        const yearB = b.mint_year_earliest ?? 0
        return yearA - yearB
      }

      // Special sorting for "adoptive-emperors" set
      if (filterSet === "adoptive-emperors") {
        const denomA = a.denomination?.toLowerCase() ?? ""
        const denomB = b.denomination?.toLowerCase() ?? ""

        // Denarius first, then all others by mint year
        const isDenariusA = denomA === "denarius"
        const isDenariusB = denomB === "denarius"

        // If one is denarius and other isn't, denarius comes first
        if (isDenariusA && !isDenariusB) return -1
        if (!isDenariusA && isDenariusB) return 1

        // If both are denarius or both are non-denarius, sort by mint start date
        const yearA = a.mint_year_earliest ?? 0
        const yearB = b.mint_year_earliest ?? 0
        return yearA - yearB
      }

      // Default sorting for all sets: by mint_year_earliest (ascending order - oldest first)
      // TODO: Implement proper historical_figures join for reign-based sorting
      // // Special sorting for "silver-emperors" set - order by reign start
      // if (filterSet === "silver-emperors") {
      //   const yearA = a.reign_start ?? 0
      //   const yearB = b.reign_start ?? 0
      //   return yearA - yearB
      // }
      const yearA = a.mint_year_earliest ?? 0
      const yearB = b.mint_year_earliest ?? 0
      return yearA - yearB
    })

  const coinsList = filteredCoins

  const handleCoinClick = (index: number) => {
    if (clickMode === "browse") {
      // Open modal for browse mode
      setModalState({ isOpen: true, currentIndex: index, focusTarget: null })
    } else {
      // Navigate to deep dive page for dive mode
      const coin = coinsList[index]
      if (coin?.id && coin?.nickname) {
        const url = generateCoinUrl(coin.id, coin.nickname)
        router.push(url)
      }
    }
  }

  const closeModal = () => {
    setModalState({ isOpen: false, currentIndex: 0, focusTarget: null })
  }

  const handlePreviousWithFocus = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0 ? coinsList.length - 1 : prev.currentIndex - 1,
      focusTarget: "previous",
    }))
  }

  const handleNextWithFocus = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === coinsList.length - 1 ? 0 : prev.currentIndex + 1,
      focusTarget: "next",
    }))
  }

  const currentCoin = coinsList[modalState.currentIndex]

  // Handle loading state
  if (isLoading) {
    return (
      <>
        {/* View Mode Controls - Skeleton */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-6 rounded-lg bg-slate-800/30 px-4 py-2 backdrop-blur-sm">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-600"></div>
            <div className="h-4 w-20 animate-pulse rounded bg-slate-600"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-slate-600"></div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-12">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="group w-fit cursor-pointer text-center">
              <div className="flex justify-center gap-2">
                <div className="flex h-[200px] w-[200px] flex-shrink-0 items-center justify-center">
                  <div className="h-[200px] w-[200px] animate-pulse rounded bg-slate-800/20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="text-red-400">
          Error loading coins:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    )
  }

  // Handle empty state
  if (coinsList.length === 0) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="text-slate-400">
          No coins with obverse images found in the collection.
        </div>
      </div>
    )
  }

  return (
    <>
      <ViewModeControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        clickMode={clickMode}
        onClickModeChange={setClickMode}
      />

      <div
        className={`flex flex-wrap justify-center ${viewMode === "both" ? "gap-x-12" : ""}`}
      >
        {coinsList.map((coin, index) => (
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
            onClick={() => handleCoinClick(index)}
            index={index + 1}
          />
        ))}
      </div>

      <BrowseCoinsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageSrc={currentCoin?.image_link_o ?? undefined}
        reverseImageSrc={currentCoin?.image_link_r ?? undefined}
        nextImageSrc={
          modalState.currentIndex < coinsList.length - 1
            ? (coinsList[modalState.currentIndex + 1]?.image_link_o ??
              undefined)
            : (coinsList[0]?.image_link_o ?? undefined)
        }
        nextReverseImageSrc={
          modalState.currentIndex < coinsList.length - 1
            ? (coinsList[modalState.currentIndex + 1]?.image_link_r ??
              undefined)
            : (coinsList[0]?.image_link_r ?? undefined)
        }
        previousImageSrc={
          modalState.currentIndex > 0
            ? (coinsList[modalState.currentIndex - 1]?.image_link_o ??
              undefined)
            : (coinsList[coinsList.length - 1]?.image_link_o ?? undefined)
        }
        previousReverseImageSrc={
          modalState.currentIndex > 0
            ? (coinsList[modalState.currentIndex - 1]?.image_link_r ??
              undefined)
            : (coinsList[coinsList.length - 1]?.image_link_r ?? undefined)
        }
        civ={currentCoin?.civ ?? undefined}
        civ_specific={currentCoin?.civ_specific ?? undefined}
        denomination={currentCoin?.denomination ?? undefined}
        mint={currentCoin?.mint ?? undefined}
        mint_year_earliest={currentCoin?.mint_year_earliest ?? undefined}
        mint_year_latest={currentCoin?.mint_year_latest ?? undefined}
        diameter={currentCoin?.diameter ?? undefined}
        mass={currentCoin?.mass ?? undefined}
        die_axis={currentCoin?.die_axis ?? undefined}
        legend_o={currentCoin?.legend_o ?? undefined}
        desc_o={currentCoin?.desc_o ?? undefined}
        legend_r={currentCoin?.legend_r ?? undefined}
        desc_r={currentCoin?.desc_r ?? undefined}
        reference={currentCoin?.reference ?? undefined}
        provenance={currentCoin?.provenance ?? undefined}
        flavour_text={currentCoin?.flavour_text ?? undefined}
        onPrevious={handlePreviousWithFocus}
        onNext={handleNextWithFocus}
        focusTarget={modalState.focusTarget}
        coinId={currentCoin?.id}
        nickname={currentCoin?.nickname}
      />
    </>
  )
}
