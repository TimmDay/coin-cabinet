"use client"

import { useState } from "react"
import { useAllSomnusCoins } from "~/api/somnus-collection"
import { BrowseCoinsModal } from "~/components/ui/BrowseCoinsModal"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { ViewModeControls } from "~/components/ui/ViewModeControls"

type YearCoinGridProps = {
  year: string
}

export function YearCoinGrid({ year }: YearCoinGridProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    currentIndex: number
    focusTarget: "previous" | "next" | null
  }>({ isOpen: false, currentIndex: 0, focusTarget: null })

  const [viewMode, setViewMode] = useState<"obverse" | "reverse" | "both">(
    "obverse",
  )

  // Fetch all coins from database (including those without images for date filtering)
  const { data: coins, isLoading, error } = useAllSomnusCoins()

  // Filter coins by purchase date year and ensure they have obverse images
  const filteredCoins = (coins ?? []).filter((coin) => {
    // Filter by purchase date year (first 4 characters)
    const purchaseDate = coin.purchase_date
    const matchesYear = purchaseDate?.toString().startsWith(year)

    // Also ensure coin has obverse image for display
    const hasObverseImage = coin.image_link_o && coin.image_link_o.trim() !== ""

    return matchesYear && hasObverseImage
  })

  const coinsList = filteredCoins

  const openModal = (index: number) => {
    setModalState({ isOpen: true, currentIndex: index, focusTarget: null })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, currentIndex: 0, focusTarget: null })
  }

  const handlePreviousWithFocus = () => {
    const newIndex =
      modalState.currentIndex > 0
        ? modalState.currentIndex - 1
        : coinsList.length - 1
    setModalState({
      ...modalState,
      currentIndex: newIndex,
      focusTarget: "previous",
    })
  }

  const handleNextWithFocus = () => {
    const newIndex =
      modalState.currentIndex < coinsList.length - 1
        ? modalState.currentIndex + 1
        : 0
    setModalState({
      ...modalState,
      currentIndex: newIndex,
      focusTarget: "next",
    })
  }

  const currentCoin = coinsList[modalState.currentIndex]

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="coin-description text-lg">Loading coins...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        <p className="coin-description text-lg">
          Error loading coins: {error.message}
        </p>
      </div>
    )
  }

  if (!coinsList.length) {
    return (
      <div className="py-8 text-center">
        <p className="coin-description text-lg">No coins found for {year}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="coin-description text-lg">
            {coinsList.length} coin{coinsList.length !== 1 ? "s" : ""} acquired
            in {year}
          </p>
        </div>

        <ViewModeControls viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

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
            onClick={() => openModal(index)}
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
        mint_id={currentCoin?.mint_id ?? undefined}
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
