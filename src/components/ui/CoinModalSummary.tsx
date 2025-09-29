"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useCallback, useEffect, useRef, useState } from "react";

type CoinModalSummaryProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  title: string;
  description: string;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  focusTarget?: "previous" | "next" | null;
  onFocusTargetHandled?: () => void;
};

export function CoinModalSummary({
  isOpen,
  onClose,
  imageSrc,
  title,
  description,
  onPrevious,
  onNext,
  currentIndex: _currentIndex = 0,
  focusTarget,
  onFocusTargetHandled: _onFocusTargetHandled,
}: CoinModalSummaryProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [displayKey, setDisplayKey] = useState(0);
  const [isSlideIn, setIsSlideIn] = useState(false);

  // Refs for chevron buttons
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Rapid interaction detection
  const lastInteractionTime = useRef<number>(0);
  const TRANSITION_DURATION = 610; // Total time for both transitions (300ms + 300ms + buffer)

  // Handle navigation with slide out then slide in
  const handlePrevious = useCallback(() => {
    if (!isTransitioning && onPrevious) {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionTime.current;
      const isRapidInteraction = timeSinceLastInteraction < TRANSITION_DURATION;

      lastInteractionTime.current = now;

      if (isRapidInteraction) {
        // Skip transition for rapid interactions
        onPrevious();
        setDisplayKey((prev) => prev + 1); // Force re-render with new key
      } else {
        // Normal transition
        setIsTransitioning(true);
        setSlideDirection("right"); // Slide right when going to previous
        setTimeout(() => {
          onPrevious();
          // Reset slide out, then trigger slide in
          setTimeout(() => {
            setIsTransitioning(false);
            setSlideDirection("left"); // New image will slide in from left
            setIsSlideIn(true);
            setDisplayKey((prev) => prev + 1); // Force re-render with new key
            // Clear slide in after animation
            setTimeout(() => {
              setIsSlideIn(false);
              setSlideDirection(null);
            }, 300);
          }, 10);
        }, 300);
      }
    }
  }, [isTransitioning, onPrevious]);

  const handleNext = useCallback(() => {
    if (!isTransitioning && onNext) {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionTime.current;
      const isRapidInteraction = timeSinceLastInteraction < TRANSITION_DURATION;

      lastInteractionTime.current = now;

      if (isRapidInteraction) {
        // Skip transition for rapid interactions
        onNext();
        setDisplayKey((prev) => prev + 1); // Force re-render with new key
      } else {
        // Normal transition
        setIsTransitioning(true);
        setSlideDirection("left"); // Slide left when going to next
        setTimeout(() => {
          onNext();
          // Reset slide out, then trigger slide in
          setTimeout(() => {
            setIsTransitioning(false);
            setSlideDirection("right"); // New image will slide in from right
            setIsSlideIn(true);
            setDisplayKey((prev) => prev + 1); // Force re-render with new key
            // Clear slide in after animation
            setTimeout(() => {
              setIsSlideIn(false);
              setSlideDirection(null);
            }, 300);
          }, 10);
        }, 300);
      }
    }
  }, [isTransitioning, onNext]);

  // Handle keyboard events on buttons
  const handlePreviousKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && onPrevious) {
        e.preventDefault();
        handlePrevious();
      }
    },
    [handlePrevious, onPrevious],
  );

  const handleNextKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && onNext) {
        e.preventDefault();
        handleNext();
      }
    },
    [handleNext, onNext],
  );

  // Handle focus restoration after navigation
  useEffect(() => {
    if (isOpen && focusTarget && !isTransitioning) {
      const targetButton =
        focusTarget === "previous"
          ? previousButtonRef.current
          : nextButtonRef.current;
      if (targetButton) {
        // Small delay to ensure the transition has completed
        setTimeout(() => {
          targetButton.focus();
        }, 100);
      }
    }
  }, [isOpen, focusTarget, isTransitioning]);
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrevious, handleNext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col items-center p-4">
        {/* Previous Button */}
        <button
          ref={previousButtonRef}
          onClick={handlePrevious}
          onKeyDown={handlePreviousKeyDown}
          disabled={isTransitioning}
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-slate-800/50 p-3 text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white disabled:opacity-50"
          aria-label="Previous coin"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        {/* Next Button */}
        <button
          ref={nextButtonRef}
          onClick={handleNext}
          onKeyDown={handleNextKeyDown}
          disabled={isTransitioning}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-slate-800/50 p-3 text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white disabled:opacity-50"
          aria-label="Next coin"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-full bg-slate-800/50 p-2 text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Main Image - Enlarged with Carousel Transition */}
        <div className="relative mb-6 flex justify-center overflow-hidden">
          {/* Current Image */}
          <div
            key={displayKey}
            className={`max-w-6xl transition-transform duration-300 ease-in-out ${
              isTransitioning
                ? slideDirection === "left"
                  ? "-translate-x-full" // Slide left when going to next
                  : "translate-x-full" // Slide right when going to previous
                : isSlideIn
                  ? slideDirection === "left"
                    ? "animate-[slideInFromLeft_300ms_ease-in-out_forwards]" // Slide in from left
                    : "animate-[slideInFromRight_300ms_ease-in-out_forwards]" // Slide in from right
                  : "translate-x-0"
            }`}
          >
            <CldImage
              src={imageSrc ?? "1_faustina_II_sestertius_o"}
              width="600"
              height="600"
              crop={{
                type: "auto",
                source: true,
              }}
              alt={title}
            />
          </div>
        </div>

        {/* Coin Information with Fade Transition */}
        <div
          className={`text-center transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <h2 className="coin-title mb-4 text-3xl font-bold">{title}</h2>
          <p className="coin-description max-w-2xl text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
}
