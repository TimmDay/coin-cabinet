"use client"

import { useState } from "react"
import { CoinCardDetail } from "~/components/ui/CoinCardDetail"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { ViewModeControls } from "~/components/ui/ViewModeControls"
import { useSomnusCoins } from "~/lib/api/somnus-collection"

export function CoinGrid() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    currentIndex: number;
    focusTarget: "previous" | "next" | null;
  }>({ isOpen: false, currentIndex: 0, focusTarget: null })

  const [viewMode, setViewMode] = useState<"obverse" | "reverse" | "both">(
    "obverse",
  )

  // Fetch coins from database (already filtered for obverse images at DB level)
  const { data: coins, isLoading, error } = useSomnusCoins()
  const coinsList = coins ?? []

  const openModal = (index: number) => {
    setModalState({ isOpen: true, currentIndex: index, focusTarget: null })
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
      <ViewModeControls viewMode={viewMode} onViewModeChange={setViewMode} />

      <div
        className={`flex flex-wrap justify-center ${viewMode === "both" ? "gap-x-12" : ""}`}
      >
        {coinsList.map((coin, index) => (
          <CoinCardGridItem
            key={coin.id || index}
            civ={coin.civ}
            nickname={coin.nickname}
            denomination={coin.denomination}
            mintYearEarliest={coin.mint_year_earliest}
            mintYearLatest={coin.mint_year_latest}
            obverseImageId={coin.image_link_o}
            reverseImageId={coin.image_link_r}
            diameter={coin.diameter}
            view={viewMode}
            onClick={() => openModal(index)}
            index={index + 1}
          />
        ))}
      </div>

      <CoinCardDetail
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
      />
    </>
  )
}
