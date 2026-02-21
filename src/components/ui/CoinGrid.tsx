"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useSomnusCoins } from "~/api/somnus-collection"
import {
  civilizationOptions,
  denominationOptions,
} from "~/app/admin/edit-somnus/coin-form-options"
import { BrowseCoinsModal } from "~/components/ui/BrowseCoinsModal"
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem"
import { FilterSelect } from "~/components/ui/FilterSelect"
import { FilterYear } from "~/components/ui/FilterYear"
import { SearchBar } from "~/components/ui/SearchBar"
import {
  ViewModeControls,
  type ClickMode,
} from "~/components/ui/ViewModeControls"
import { useDeityOptions } from "~/hooks/useDeityOptions"
import { generateCoinUrl } from "~/lib/utils/url-helpers"

type CoinGridProps = {
  filterSet?: string
  filterCiv?: string
  showSearch?: boolean
  showProvenance?: boolean
}

export function CoinGrid({
  filterSet,
  filterCiv,
  showSearch = false,
  showProvenance = false,
}: CoinGridProps = {}) {
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

  const [searchQuery, setSearchQuery] = useState("")

  // Year filter state
  const [yearStart, setYearStart] = useState<string>("")
  const [yearEnd, setYearEnd] = useState<string>("")

  // Denomination and civilization filter state
  const [filterDenomination, setFilterDenomination] = useState<string>("")
  const [filterCivilization, setFilterCivilization] = useState<string>("")

  // Fetch coins from database (already filtered for obverse images at DB level)
  const { data: coins, isLoading, error } = useSomnusCoins()

  // Fetch deities for name lookup
  const { options: deityOptions } = useDeityOptions()

  // Create deity ID to name map
  const deityMap = useMemo(() => {
    const map = new Map<string, string>()
    deityOptions.forEach((deity) => {
      map.set(deity.value, deity.label)
    })
    return map
  }, [deityOptions])

  // Filter coins by set and/or civilization, then sort by mint_year_earliest
  const filteredCoins = (coins ?? [])
    .filter((coin) => {
      let matchesSet = true
      let matchesCiv = true
      let matchesSearch = true
      let matchesYearRange = true
      let matchesDenomination = true
      let matchesCivilization = true

      if (filterSet) {
        matchesSet = coin.sets?.includes(filterSet) ?? false
      }

      if (filterCiv) {
        matchesCiv = coin.civ === filterCiv
      }

      // Apply denomination filter from dropdown
      if (showSearch && filterDenomination) {
        matchesDenomination = coin.denomination === filterDenomination
      }

      // Apply civilization filter from dropdown
      if (showSearch && filterCivilization) {
        matchesCivilization = coin.civ === filterCivilization
      }

      // Apply search filter if search is enabled and query exists
      if (showSearch && searchQuery.trim()) {
        const query = searchQuery.toLowerCase()

        // Get deity names for this coin
        const deityNames = (coin.deity_id ?? [])
          .map((id) => deityMap.get(id) ?? "")
          .filter(Boolean)
          .join(" ")

        matchesSearch = [
          coin.nickname ?? "",
          coin.denomination ?? "",
          coin.legend_o ?? "",
          coin.legend_r ?? "",
          deityNames,
        ].some((field) => field.toLowerCase().includes(query))
      }

      // Apply year range filter
      if (showSearch && (yearStart || yearEnd)) {
        const startYear = yearStart ? parseInt(yearStart, 10) : null
        const endYear = yearEnd ? parseInt(yearEnd, 10) : null

        const coinYearEarliest = coin.mint_year_earliest ?? null
        const coinYearLatest = coin.mint_year_latest ?? null

        // A coin matches if either of its years falls within the range
        if (startYear !== null && !isNaN(startYear)) {
          const hasYearAfterStart =
            (coinYearEarliest !== null && coinYearEarliest >= startYear) ||
            (coinYearLatest !== null && coinYearLatest >= startYear)
          if (!hasYearAfterStart) matchesYearRange = false
        }

        if (endYear !== null && !isNaN(endYear)) {
          const hasYearBeforeEnd =
            (coinYearEarliest !== null && coinYearEarliest <= endYear) ||
            (coinYearLatest !== null && coinYearLatest <= endYear)
          if (!hasYearBeforeEnd) matchesYearRange = false
        }
      }

      return (
        matchesSet &&
        matchesCiv &&
        matchesSearch &&
        matchesYearRange &&
        matchesDenomination &&
        matchesCivilization
      )
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
      const yearA = a.mint_year_earliest ?? 0
      const yearB = b.mint_year_earliest ?? 0
      return yearA - yearB
    })

  const handleCoinClick = (index: number) => {
    if (clickMode === "browse") {
      // Open modal for browse mode
      setModalState({ isOpen: true, currentIndex: index, focusTarget: null })
    } else {
      // Navigate to deep dive page for dive mode
      const coin = filteredCoins[index]
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
        prev.currentIndex === 0
          ? filteredCoins.length - 1
          : prev.currentIndex - 1,
      focusTarget: "previous",
    }))
  }

  const handleNextWithFocus = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === filteredCoins.length - 1
          ? 0
          : prev.currentIndex + 1,
      focusTarget: "next",
    }))
  }

  const currentCoin = filteredCoins[modalState.currentIndex]

  return (
    <>
      {/* Controls row */}
      {showSearch ? (
        <div className="flex flex-col items-center gap-3">
          <ViewModeControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            clickMode={clickMode}
            onClickModeChange={setClickMode}
          />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Year filters row */}
          <div className="flex w-80 gap-2">
            <FilterYear
              id="year-start"
              value={yearStart}
              onChange={setYearStart}
              placeholder="Year start"
              label="Year start"
            />
            <FilterYear
              id="year-end"
              value={yearEnd}
              onChange={setYearEnd}
              placeholder="Year end"
              label="Year end"
            />
          </div>

          {/* Denomination and Civilization filters row */}
          <div className="flex w-80 gap-2">
            <FilterSelect
              id="filter-denomination"
              value={filterDenomination}
              onChange={setFilterDenomination}
              options={denominationOptions}
              placeholder="Denomination"
              label="Denomination"
            />
            <FilterSelect
              id="filter-civilization"
              value={filterCivilization}
              onChange={setFilterCivilization}
              options={civilizationOptions}
              placeholder="Civilisation"
              label="Civilisation"
            />
          </div>
        </div>
      ) : (
        <ViewModeControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          clickMode={clickMode}
          onClickModeChange={setClickMode}
        />
      )}

      {/* Loading state */}
      {isLoading && (
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
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="mt-12 flex justify-center">
          <div className="text-red-400">
            Error loading coins:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredCoins.length === 0 && (
        <div className="mt-12 flex justify-center">
          <div className="text-slate-400">
            No coins with obverse images found in the collection.
          </div>
        </div>
      )}

      {/* Coin grid */}
      {!isLoading && !error && filteredCoins.length > 0 && (
        <div
          className={`flex flex-wrap justify-center ${viewMode === "both" ? "gap-x-12" : ""}`}
        >
          {filteredCoins.map((coin, index) => (
            <CoinCardGridItem
              key={coin.id}
              civ={coin.civ}
              civSpecific={coin.civ_specific}
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
              provenance={coin.provenance}
              showProvenance={showProvenance}
            />
          ))}
        </div>
      )}

      <BrowseCoinsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageSrc={currentCoin?.image_link_o ?? undefined}
        reverseImageSrc={currentCoin?.image_link_r ?? undefined}
        nextImageSrc={
          modalState.currentIndex < filteredCoins.length - 1
            ? (filteredCoins[modalState.currentIndex + 1]?.image_link_o ??
              undefined)
            : (filteredCoins[0]?.image_link_o ?? undefined)
        }
        nextReverseImageSrc={
          modalState.currentIndex < filteredCoins.length - 1
            ? (filteredCoins[modalState.currentIndex + 1]?.image_link_r ??
              undefined)
            : (filteredCoins[0]?.image_link_r ?? undefined)
        }
        previousImageSrc={
          modalState.currentIndex > 0
            ? (filteredCoins[modalState.currentIndex - 1]?.image_link_o ??
              undefined)
            : (filteredCoins[filteredCoins.length - 1]?.image_link_o ??
              undefined)
        }
        previousReverseImageSrc={
          modalState.currentIndex > 0
            ? (filteredCoins[modalState.currentIndex - 1]?.image_link_r ??
              undefined)
            : (filteredCoins[filteredCoins.length - 1]?.image_link_r ??
              undefined)
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
