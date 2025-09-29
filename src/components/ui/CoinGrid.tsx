"use client";

import { useState } from "react";
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem";
import { CoinModalSummary } from "~/components/ui/CoinModalSummary";
import { useSomnusCoins } from "~/lib/api/somnus-collection";

export function CoinGrid() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    currentIndex: number;
    focusTarget: "previous" | "next" | null;
  }>({ isOpen: false, currentIndex: 0, focusTarget: null });

  // Fetch coins from database and filter out those missing obverse images
  const { data: allCoins, isLoading, error } = useSomnusCoins();
  const coins =
    allCoins?.filter(
      (coin) => coin.image_link_o && coin.image_link_o.trim() !== "",
    ) ?? [];

  const openModal = (index: number) => {
    setModalState({ isOpen: true, currentIndex: index, focusTarget: null });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, currentIndex: 0, focusTarget: null });
  };

  const handleFocusTargetHandled = () => {
    // Clear the focus target after it's been handled
    setModalState((prev) => ({
      ...prev,
      focusTarget: null,
    }));
  };

  const handlePreviousWithFocus = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0 ? coins.length - 1 : prev.currentIndex - 1,
      focusTarget: "previous",
    }));
  };

  const handleNextWithFocus = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === coins.length - 1 ? 0 : prev.currentIndex + 1,
      focusTarget: "next",
    }));
  };

  const currentCoin = coins[modalState.currentIndex];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="text-slate-400">Loading coins...</div>
      </div>
    );
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
    );
  }

  // Handle empty state
  if (coins.length === 0) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="text-slate-400">
          No coins with obverse images found in the collection.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
        {coins.map((coin, index) => (
          <CoinCardGridItem
            key={coin.id || index}
            civ={coin.civ}
            nickname={coin.nickname}
            denomination={coin.denomination}
            mintYearEarliest={coin.mint_year_earliest}
            mintYearLatest={coin.mint_year_latest}
            obverseImageId={coin.image_link_o}
            reverseImageId={coin.image_link_r}
            onClick={() => openModal(index)}
          />
        ))}
      </div>

      <CoinModalSummary
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageSrc={
          currentCoin?.image_link_o ?? currentCoin?.image_link_r ?? undefined
        }
        title={`${currentCoin?.nickname ?? ""} ${currentCoin?.denomination ?? ""}`.trim()}
        description={`${currentCoin?.civ ?? ""} coin`}
        onPrevious={handlePreviousWithFocus}
        onNext={handleNextWithFocus}
        currentIndex={modalState.currentIndex}
        focusTarget={modalState.focusTarget}
        onFocusTargetHandled={handleFocusTargetHandled}
      />
    </>
  );
}
