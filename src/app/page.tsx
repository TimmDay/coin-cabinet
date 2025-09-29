"use client";

import { useState } from "react";
import { GridCoinCard } from "~/components/ui/CoinCard";
import { CoinModal } from "~/components/ui/CoinModal";

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
  }>({ isOpen: false, currentIndex: 0 });

  const openModal = (index: number) => {
    setModalState({ isOpen: true, currentIndex: index });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, currentIndex: 0 });
  };

  const goToPrevious = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0 ? coins.length - 1 : prev.currentIndex - 1,
    }));
  };

  const goToNext = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === coins.length - 1 ? 0 : prev.currentIndex + 1,
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
            <GridCoinCard
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

      <CoinModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageSrc={currentCoin?.imageSrc}
        title={currentCoin?.title ?? ""}
        description={currentCoin?.description ?? ""}
        onPrevious={goToPrevious}
        onNext={goToNext}
        currentIndex={modalState.currentIndex}
      />
    </main>
  );
}
