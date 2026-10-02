"use client"

import Image from "next/image"
import { useId, useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { cn } from "~/lib/utils"
import { FormattedLegendExpanded } from "~/components/FormattedLegendExpanded"
import type { Device } from "~/database/schema-devices"
import type { ClockNote } from "~/types/api"
import { CoinClockTips } from "./CoinClockTips"
import { DescriptionWithDeviceHighlights } from "./DescriptionWithDeviceHighlights"
import { ImageModal } from "./ImageModal"
import { TipIcon } from "./TipIcon"

type CoinRowProps = {
  side: "obverse" | "reverse"
  imageLink: string
  imageLinkAltlight?: string | null
  imageLinkSketch?: string | null
  legendExpanded?: string | null
  legendTranslation?: string | null
  /** Shown on a new line under the legend, in the legend's style. */
  mintMark?: string | null
  description?: string | null
  flavourText?: string | null
  devices?: Device[]
  clockNotes?: ClockNote[]
  /** Room above and below the coin for clock buttons. Decided for both faces together, so the two coins stay level. */
  reserveTop?: boolean
  reserveBottom?: boolean
  priority?: boolean
}

export function CoinRow({
  side,
  imageLink,
  imageLinkAltlight,
  imageLinkSketch,
  legendExpanded,
  legendTranslation,
  mintMark,
  description,
  flavourText,
  devices = [],
  clockNotes = [],
  reserveTop = false,
  reserveBottom = false,
  priority = false,
}: CoinRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string>("")
  const [modalImageAlt, setModalImageAlt] = useState<string>("")

  // State for mobile image switching
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0)

  const hasAnyText = Boolean(
    legendExpanded || legendTranslation || mintMark || flavourText,
  )

  // Available images array for mobile switching
  const availableImages = [
    { src: imageLink, alt: `${side} of coin`, label: "main" },
    ...(imageLinkAltlight
      ? [
          {
            src: imageLinkAltlight,
            alt: `${side} of coin (alternative lighting)`,
            label: "alt light",
          },
        ]
      : []),
    ...(imageLinkSketch
      ? [
          {
            src: imageLinkSketch,
            alt: `${side} sketch of coin`,
            label: "sketch",
          },
        ]
      : []),
  ]

  const handleImageClick = (imageUrl: string, altText: string) => {
    setModalImageUrl(imageUrl)
    setModalImageAlt(altText)
    setIsModalOpen(true)
  }

  return (
    // On desktop the root spans three rows of the parent grid (image, text,
    // switcher) so both faces line up row by row.
    <div className="mx-auto flex max-w-7xl flex-col space-y-4 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:justify-items-center lg:space-y-0">
      {/* Images Section */}
      {/* Room above the coin only when a clock button hangs there */}
      <div
        className={cn(
          "flex justify-center px-3 sm:px-14 lg:row-start-1 lg:flex-shrink-0",
          reserveTop && "pt-10 sm:pt-14",
        )}
      >
        <div className="relative w-full max-w-md lg:h-[350px] lg:w-[350px] lg:max-w-none xl:h-[460px] xl:w-[460px]">
          {/* Main displayed image */}
          <div
            className="artemis-card flex aspect-square w-full cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105"
            onClick={() => {
              const currentImage = availableImages[currentMobileImageIndex]
              if (currentImage) {
                handleImageClick(currentImage.src, currentImage.alt)
              }
            }}
          >
            <div className="max-h-full max-w-full">
              {availableImages[currentMobileImageIndex] && (
                <CloudinaryImage
                  src={availableImages[currentMobileImageIndex].src}
                  alt={availableImages[currentMobileImageIndex].alt}
                  width={480}
                  height={480}
                  priority={priority && currentMobileImageIndex === 0}
                  trim
                />
              )}
            </div>
          </div>

          <CoinClockTips notes={clockNotes} />
        </div>
      </div>

      {/* Text content */}
      {hasAnyText && (
        <div
          className={cn(
            "flex flex-col space-y-2 text-center lg:row-start-2 lg:w-[350px] xl:w-[460px]",
            reserveBottom && "mt-9 sm:mt-12",
          )}
        >
          {(legendExpanded || mintMark) && (
            <p className="font-display relative text-[1.75rem] tracking-[0.08em] break-words text-slate-400 xl:text-[2rem]">
              {legendExpanded && (
                <FormattedLegendExpanded text={legendExpanded} />
              )}
              {legendExpanded && legendTranslation && (
                <TranslationTip translation={legendTranslation} />
              )}
              {/* The mint mark reads as the legend continuing on a new line */}
              {mintMark && (
                <>
                  {legendExpanded && <br />}
                  <span className="uppercase">{mintMark}</span>
                </>
              )}
            </p>
          )}

          {!legendExpanded && legendTranslation && (
            <div className="relative">
              <TranslationTip translation={legendTranslation} />
            </div>
          )}

          {flavourText && (
            <p className="mt-3 hidden text-base leading-relaxed break-words text-slate-400 lg:block">
              {flavourText}
            </p>
          )}
        </div>
      )}

      {/* Switcher buttons for alternate images */}
      {(description || availableImages.length > 1) && (
        <div className="relative flex flex-row items-center justify-center gap-2 lg:row-start-3">
          {/* A fixed slot at the left, so the swap buttons sit in the same
              place whether or not this side has a description */}
          <div className="h-10 w-10 shrink-0">
            {description && (
              <TipIcon
                size="lg"
                label="Show description"
                icon={<ScrollIcon />}
                interactive
                popoverClassName="bottom-full top-auto mt-0 mb-2 w-[min(24rem,calc(100vw-2rem))] max-w-none px-4 py-3 text-center text-base"
              >
                <span className="font-display mb-2 block text-center text-lg tracking-widest uppercase">
                  Description
                </span>
                <DescriptionWithDeviceHighlights
                  text={description}
                  devices={devices}
                  className="leading-relaxed break-words italic"
                />
              </TipIcon>
            )}
          </div>
          {availableImages.length > 1 &&
            availableImages.map((image, index) => (
              <button
                key={index}
                className={`artemis-card flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 hover:border-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:outline-none ${
                  index === currentMobileImageIndex
                    ? "border-slate-400"
                    : "border-slate-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentMobileImageIndex(index)
                }}
                aria-label={`Switch to ${image.label} image`}
              >
                <div className="h-full w-full overflow-hidden rounded-full">
                  <CloudinaryImage
                    src={image.src}
                    alt={`${image.label} thumbnail`}
                    width={56}
                    height={56}
                  />
                </div>
              </button>
            ))}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={modalImageUrl}
        alt={modalImageAlt}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

/**
 * The small button at the end of a legend that shows its translation. The
 * popover opens directly to the left of the button, centred on it vertically.
 * The button's bottom edge sits on the baseline, which centres it on the
 * capitals.
 */
function TranslationTip({ translation }: { translation: string }) {
  return (
    <TipIcon
      size="sm"
      label="Show translation"
      className="relative ml-2 align-baseline"
      popoverClassName="top-1/2 right-full left-auto mt-0 mr-2 max-w-[min(20rem,calc(100vw-6rem))] -translate-x-0 -translate-y-1/2 font-sans text-left font-normal tracking-normal normal-case"
    >
      {translation}
    </TipIcon>
  )
}

/**
 * The scroll from the timeline's events, drawn in the same colour as the
 * button's border (moonlight, 70% until hover). The source image is black
 * strokes on a light background with a faint checkerboard baked in, so a
 * colour-matrix filter turns brightness into transparency (the checkerboard's
 * greys fall below the cut-off and vanish) and paints what is left moonlight.
 */
function ScrollIcon() {
  // CSS url(#id) cannot take the colons React puts in generated ids
  const filterId = `scroll-tint-${useId().replace(/:/g, "")}`
  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter
          id={filterId}
          x="0"
          y="0"
          width="1"
          height="1"
          colorInterpolationFilters="sRGB"
        >
          {/* moonlight is slate-400, rgb(148 163 184). Alpha is high for dark pixels only, and the region is the image itself so the empty margin is not painted. */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.5804  0 0 0 0 0.6392  0 0 0 0 0.7216  -0.8333 -0.8333 -0.8333 0 1.9"
          />
        </filter>
      </svg>
      <Image
        src="/assets/icon-scroll.png"
        alt=""
        width={24}
        height={24}
        className="opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ filter: `url(#${filterId})` }}
      />
    </>
  )
}
