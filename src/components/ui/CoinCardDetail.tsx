"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { CldImage } from "next-cloudinary"
import { useCallback, useEffect, useRef, useState } from "react"
import { prefetchCloudinaryImage } from "~/components/CloudinaryImage"
import { useViewport } from "~/hooks/useViewport"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { IconButton } from "./IconButton"
import { InfoTooltip } from "./InfoTooltip"

type CoinCardDetailProps = {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  reverseImageSrc?: string;
  nextImageSrc?: string;
  nextReverseImageSrc?: string;
  previousImageSrc?: string;
  previousReverseImageSrc?: string;
  civ?: string;
  civ_specific?: string;
  denomination?: string;
  mint?: string;
  mint_year_earliest?: number;
  mint_year_latest?: number;
  diameter?: number;
  mass?: number;
  die_axis?: string;
  legend_o?: string;
  desc_o?: string;
  legend_r?: string;
  desc_r?: string;
  reference?: string;
  provenance?: string;
  flavour_text?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  focusTarget?: "previous" | "next" | null;
};

export function CoinCardDetail({
  isOpen,
  onClose,
  imageSrc,
  reverseImageSrc,
  nextImageSrc,
  nextReverseImageSrc,
  previousImageSrc,
  previousReverseImageSrc,
  civ,
  civ_specific,
  denomination,
  mint,
  mint_year_earliest,
  mint_year_latest,
  diameter,
  mass,
  die_axis,
  legend_o,
  desc_o,
  legend_r,
  desc_r,
  reference,
  provenance,
  flavour_text,
  onPrevious,
  onNext,
  focusTarget,
}: CoinCardDetailProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  )
  const [displayKey, setDisplayKey] = useState(0)
  const [isSlideIn, setIsSlideIn] = useState(false)
  const [isReverse, setIsReverse] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 }) // percentage values
  const [isFlipFading, setIsFlipFading] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useViewport()

  // Refs for chevron buttons
  const previousButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  // Rapid interaction detection
  const lastInteractionTime = useRef<number>(0)
  const TRANSITION_DURATION = 410 // Total time for both transitions (200ms + 200ms + buffer)

  // Handle flip between obverse and reverse
  const handleFlip = useCallback(() => {
    setIsFlipFading(true)
    // Reset zoom when flipping
    setIsZoomed(false)

    setTimeout(() => {
      setIsReverse((prev) => !prev)
      setDisplayKey((prev) => prev + 1) // Force re-render with new key

      setTimeout(() => {
        setIsFlipFading(false)
      }, 10) // Small delay to ensure state change is processed
    }, 150) // Fade out duration
  }, [])

  // Calculate coin age (rounded to nearest 50)
  const coinAge = mint_year_latest
    ? Math.round((new Date().getFullYear() - mint_year_latest) / 50) * 50
    : null

  // Prefetch handlers for chevron hover - only prefetch the current view (obverse or reverse)
  const handlePreviousHover = useCallback(() => {
    const imageToPrefetch = isReverse
      ? previousReverseImageSrc
      : previousImageSrc
    prefetchCloudinaryImage(imageToPrefetch, 600, 600)
  }, [previousImageSrc, previousReverseImageSrc, isReverse])

  const handleNextHover = useCallback(() => {
    const imageToPrefetch = isReverse ? nextReverseImageSrc : nextImageSrc
    prefetchCloudinaryImage(imageToPrefetch, 600, 600)
  }, [nextImageSrc, nextReverseImageSrc, isReverse])

  // Handle image zoom
  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return

      if (isZoomed) {
        // If already zoomed, reset to normal
        setIsZoomed(false)
      } else {
        // Calculate click position as percentage of image dimensions
        const rect = imageRef.current.getBoundingClientRect()
        const clickX = ((e.clientX - rect.left) / rect.width) * 100
        const clickY = ((e.clientY - rect.top) / rect.height) * 100

        const zoomScale = 2.4

        // Calculate what percentage of the original image is visible after zoom
        const visiblePercent = 100 / zoomScale // ~41.67% at 2.4x zoom

        // The transform-origin can be positioned so that half the visible area extends on each side
        const halfVisible = visiblePercent / 2 // ~20.83%

        // Safe bounds: add a small buffer to account for any container effects
        const buffer = 2 // 2% buffer
        const minSafe = halfVisible + buffer
        const maxSafe = 100 - halfVisible - buffer

        // Clamp the click position to safe bounds
        const safeX = Math.max(minSafe, Math.min(maxSafe, clickX))
        const safeY = Math.max(minSafe, Math.min(maxSafe, clickY))

        setZoomOrigin({ x: safeX, y: safeY })
        setIsZoomed(true)
      }
    },
    [isZoomed],
  )

  // Handle navigation with slide out then slide in
  const handlePrevious = useCallback(() => {
    if (!isTransitioning && onPrevious) {
      const now = Date.now()
      const timeSinceLastInteraction = now - lastInteractionTime.current
      const isRapidInteraction = timeSinceLastInteraction < TRANSITION_DURATION

      lastInteractionTime.current = now

      if (isRapidInteraction) {
        // Skip transition for rapid interactions
        onPrevious()
        setDisplayKey((prev) => prev + 1) // Force re-render with new key
        setIsZoomed(false) // Reset zoom on navigation
      } else {
        // Normal transition
        setIsTransitioning(true)
        setSlideDirection("right") // Slide right when going to previous
        setTimeout(() => {
          onPrevious()
          setIsZoomed(false) // Reset zoom on navigation
          // Reset slide out, then trigger slide in
          setTimeout(() => {
            setIsTransitioning(false)
            setSlideDirection("left") // New image will slide in from left
            setIsSlideIn(true)
            setDisplayKey((prev) => prev + 1) // Force re-render with new key
            // Clear slide in after animation
            setTimeout(() => {
              setIsSlideIn(false)
              setSlideDirection(null)
            }, 150)
          }, 10)
        }, 200)
      }
    }
  }, [isTransitioning, onPrevious])

  const handleNext = useCallback(() => {
    if (!isTransitioning && onNext) {
      const now = Date.now()
      const timeSinceLastInteraction = now - lastInteractionTime.current
      const isRapidInteraction = timeSinceLastInteraction < TRANSITION_DURATION

      lastInteractionTime.current = now

      if (isRapidInteraction) {
        // Skip transition for rapid interactions
        onNext()
        setDisplayKey((prev) => prev + 1) // Force re-render with new key
        setIsZoomed(false) // Reset zoom on navigation
      } else {
        // Normal transition
        setIsTransitioning(true)
        setSlideDirection("left") // Slide left when going to next
        setTimeout(() => {
          onNext()
          setIsZoomed(false) // Reset zoom on navigation
          // Reset slide out, then trigger slide in
          setTimeout(() => {
            setIsTransitioning(false)
            setSlideDirection("right") // New image will slide in from right
            setIsSlideIn(true)
            setDisplayKey((prev) => prev + 1) // Force re-render with new key
            // Clear slide in after animation
            setTimeout(() => {
              setIsSlideIn(false)
              setSlideDirection(null)
            }, 150)
          }, 10)
        }, 200)
      }
    }
  }, [isTransitioning, onNext])

  // Handle keyboard events on buttons
  const handlePreviousKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && onPrevious) {
        e.preventDefault()
        handlePrevious()
      }
    },
    [handlePrevious, onPrevious],
  )

  const handleNextKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && onNext) {
        e.preventDefault()
        handleNext()
      }
    },
    [handleNext, onNext],
  )

  // Handle focus restoration after navigation
  useEffect(() => {
    if (isOpen && focusTarget && !isTransitioning) {
      const targetButton =
        focusTarget === "previous"
          ? previousButtonRef.current
          : nextButtonRef.current
      if (targetButton) {
        // Small delay to ensure the transition has completed
        setTimeout(() => {
          targetButton.focus()
        }, 100)
      }
    }
  }, [isOpen, focusTarget, isTransitioning])
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        handleFlip()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, handlePrevious, handleNext, handleFlip])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-4 lg:items-center lg:py-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 flex min-h-full w-full max-w-7xl p-4 lg:max-h-[90vh] lg:min-h-0">
        {/* Close Button */}
        <IconButton
          icon={X}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 lg:-top-12 lg:right-0"
          aria-label="Close modal"
        />

        {/* Desktop Chevrons */}
        {!isMobile && (
          <>
            <IconButton
              icon={ChevronLeft}
              iconSize="lg"
              variant="large"
              onClick={handlePrevious}
              onKeyDown={handlePreviousKeyDown}
              onMouseEnter={handlePreviousHover}
              disabled={isTransitioning}
              className="absolute top-1/2 left-4 z-20 -translate-x-0.5 -translate-y-1/2"
              aria-label="Previous coin"
            />

            <IconButton
              icon={ChevronRight}
              iconSize="lg"
              variant="large"
              onClick={handleNext}
              onKeyDown={handleNextKeyDown}
              onMouseEnter={handleNextHover}
              disabled={isTransitioning}
              className="absolute top-1/2 left-1/2 z-20 translate-x-[calc(33.33%+5rem+4px)] -translate-y-1/2"
              aria-label="Next coin"
            />
          </>
        )}

        {/* Main Content Layout */}
        <div className="flex w-full flex-col lg:flex-row lg:gap-8">
          {/* Top/Left Side - Image */}
          <div className="relative flex items-center justify-center lg:flex-[2]">
            {/* Mobile Chevrons */}
            {isMobile && (
              <>
                <IconButton
                  ref={previousButtonRef}
                  icon={ChevronLeft}
                  variant="large"
                  onClick={handlePrevious}
                  onKeyDown={handlePreviousKeyDown}
                  onMouseEnter={handlePreviousHover}
                  disabled={isTransitioning}
                  className="absolute bottom-4 left-4 z-20 -translate-x-0.5"
                  aria-label="Previous coin"
                />

                <IconButton
                  ref={nextButtonRef}
                  icon={ChevronRight}
                  variant="large"
                  onClick={handleNext}
                  onKeyDown={handleNextKeyDown}
                  onMouseEnter={handleNextHover}
                  disabled={isTransitioning}
                  className="absolute right-4 bottom-4 z-20 translate-x-0.5"
                  aria-label="Next coin"
                />
              </>
            )}

            <div
              className="relative cursor-pointer overflow-visible"
              onClick={handleImageClick}
              ref={imageRef}
            >
              {/* Current Image - wrapped in v-stacking container for btn beneath*/}

              {/* <div className="flex flex-col items-center"> */}
              <div
                key={displayKey}
                className={`transition-all duration-200 ease-in-out ${isFlipFading ? "opacity-0" : "opacity-100"} ${
                  isTransitioning
                    ? slideDirection === "left"
                      ? "-translate-x-full" // Slide left when going to next
                      : "translate-x-full" // Slide right when going to previous
                    : isSlideIn
                      ? slideDirection === "left"
                        ? "animate-[slideInFromLeft_150ms_ease-in-out_forwards]" // Slide in from left
                        : "animate-[slideInFromRight_150ms_ease-in-out_forwards]" // Slide in from right
                      : "translate-x-0"
                } ${isZoomed ? "scale-[2.4]" : "scale-100"}`}
                {...(isZoomed && {
                  style: {
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  },
                })}
              >
                <CldImage
                  src={
                    (isReverse ? reverseImageSrc : imageSrc) ??
                    "1_faustina_II_sestertius_o"
                  }
                  width="600"
                  height="600"
                  crop={{
                    type: "pad",
                    source: true,
                  }}
                  background="transparent"
                  alt={
                    isReverse
                      ? (desc_r ?? "Reverse side of coin")
                      : (desc_o ?? "Obverse side of coin")
                  }
                />
              </div>

              {/* <button>banana</button>
              </div> */}
            </div>
          </div>

          {/* Bottom/Right Side - Information Panel */}
          <div className="mr-0 bg-black p-6 backdrop-blur-sm lg:-mr-8 lg:max-h-[80vh] lg:flex-1 lg:overflow-y-auto lg:rounded-lg lg:p-8">
            <div
              className={`text-center transition-opacity duration-200 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Mobile Flip Button - at top */}
              {isMobile && (
                <div className="mb-6 flex items-center justify-center">
                  <button
                    onClick={handleFlip}
                    className="cursor-pointer rounded-md border border-slate-600/50 bg-slate-700/50 px-6 py-2 text-sm font-medium tracking-wider text-slate-300 transition-all duration-200 hover:border-slate-500/50 hover:bg-slate-600/50 hover:text-slate-200"
                  >
                    FLIP
                  </button>
                </div>
              )}

              <h2 className="text-l mb-3 text-slate-400">
                {`${civ?.toUpperCase()}${civ_specific ? ` (${civ_specific})` : ""}. ${mint}. ${formatYearRange(mint_year_earliest, mint_year_latest)}`}
              </h2>

              {/* Physical Properties Line */}
              <p className="mb-4 text-base text-slate-400">
                {`${denomination} | ${diameter} mm  |  ${mass} g ${die_axis ? `| ${die_axis}` : ""}`}
              </p>

              {/* Legend */}
              <p
                className={`mb-3 text-3xl text-slate-400 uppercase transition-opacity duration-150 ease-in-out ${isFlipFading ? "opacity-0" : "opacity-100"}`}
              >
                {isReverse ? legend_r : legend_o}
              </p>

              {/* Description */}
              <p
                className={`mt-2 text-base text-slate-400 transition-opacity duration-150 ease-in-out ${isFlipFading ? "opacity-0" : "opacity-100"}`}
              >
                {isReverse ? desc_r : desc_o}
              </p>

              {/* Reference and Provenance */}
              <div className="mt-4">
                <span className="text-sm text-slate-400">{reference}</span>
                {provenance && (
                  <span className="ml-2 text-xs text-slate-400 italic">
                    {provenance}
                  </span>
                )}
              </div>

              {/* Action Buttons - Desktop only */}
              {!isMobile && (
                <div className="relative mt-6 flex items-center justify-center">
                  {/* Flip Button - centered */}
                  <button
                    onClick={handleFlip}
                    className="cursor-pointer rounded-md border border-slate-600/50 bg-slate-700/50 px-6 py-2 text-sm font-medium tracking-wider text-slate-300 transition-all duration-200 hover:border-slate-500/50 hover:bg-slate-600/50 hover:text-slate-200"
                  >
                    FLIP
                  </button>

                  {/* Info Tooltip - Only show if flavour_text is available, positioned absolutely to the right */}
                  {flavour_text && (
                    <div className="absolute right-4">
                      <InfoTooltip
                        content={`${coinAge ? `~${coinAge} years old\n\n` : ""}${flavour_text}`}
                        id="coin-tooltip"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Info Tooltip - separate from flip button */}
              {isMobile && flavour_text && (
                <div className="mt-6 flex items-center justify-center">
                  <InfoTooltip
                    content={`${coinAge ? `~${coinAge} years old\n\n` : ""}${flavour_text}`}
                    id="coin-tooltip"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
