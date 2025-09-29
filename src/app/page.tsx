"use client";

import { useState } from "react";
import { CoinCardGridItem } from "~/components/ui/CoinCardGridItem";
import { CoinModalSummary } from "~/components/ui/CoinModalSummary";

// Define the coin data
const coins = [
  {
    title: "Featured Coin",
    description: "Explore the details of our latest acquisition",
    imageSrc: undefined,
  },
  {
    title: "Faustina II",
    description: "Sestertius, obverse view",
    imageSrc: "1_faustina_II_sestertius_o_qnuswl",
  },
  {
    title: "Faustina II",
    description: "Sestertius, reverse view",
    imageSrc: "1_faustina_II_sestertius_r_hy1nu3",
  },
];

export default function HomePage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    currentIndex: number;
    focusTarget: "previous" | "next" | null;
  }>({ isOpen: false, currentIndex: 0, focusTarget: null });

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
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-200 sm:text-6xl lg:text-7xl">
            The Coin <span className="heading-accent">Cabinet</span>
          </h1>
          <p className="coin-description mx-auto max-w-2xl text-xl">
            A curated collection of ancient coins, combining the art of
            numismatics with modern photography and digital presentation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {coins.map((coin, index) => (
            <CoinCardGridItem
              key={index}
              title={coin.title}
              description={coin.description}
              imageSrc={coin.imageSrc}
              onClick={() => openModal(index)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Discover the fascinating world of ancient numismatics through our
            carefully documented collection.
          </p>
          <button className="somnus-button px-8 py-3 text-lg font-medium">
            Explore the Collection
          </button>
        </div>
      </div>

      <CoinModalSummary
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageSrc={currentCoin?.imageSrc}
        title={currentCoin?.title ?? ""}
        description={currentCoin?.description ?? ""}
        onPrevious={handlePreviousWithFocus}
        onNext={handleNextWithFocus}
        currentIndex={modalState.currentIndex}
        focusTarget={modalState.focusTarget}
        onFocusTargetHandled={handleFocusTargetHandled}
      />
    </main>
  );
}
