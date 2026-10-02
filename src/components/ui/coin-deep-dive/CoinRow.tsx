"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { FormattedLegendExpanded } from "~/components/FormattedLegendExpanded"
import type { Device } from "~/database/schema-devices"
import { CoinClockTips, DEMO_CLOCK_NOTES } from "./CoinClockTips"
import { DescriptionWithDeviceHighlights } from "./DescriptionWithDeviceHighlights"
import { ImageModal } from "./ImageModal"

type CoinRowProps = {
  side: "obverse" | "reverse"
  imageLink: string
  imageLinkAltlight?: string | null
  imageLinkSketch?: string | null
  legendExpanded?: string | null
  legendTranslation?: string | null
  description?: string | null
  flavourText?: string | null
  devices?: Device[]
  priority?: boolean
}

export function CoinRow({
  side,
  imageLink,
  imageLinkAltlight,
  imageLinkSketch,
  legendExpanded,
  legendTranslation,
  description,
  flavourText,
  devices = [],
  priority = false,
}: CoinRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string>("")
  const [modalImageAlt, setModalImageAlt] = useState<string>("")

  // State for mobile image switching
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0)

  const clockNotes = DEMO_CLOCK_NOTES
  const hasAnyText = Boolean(
    legendExpanded || legendTranslation || description || flavourText,
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
    <div className="mx-auto max-w-7xl">
      {/* All screen sizes: Single Image with Mini-Image Buttons */}
      <div className="flex flex-col space-y-4 lg:items-center lg:space-y-6">
        {/* Images Section */}
        {/* Room all the way round for the clock buttons, used or not */}
        <div className="flex justify-center px-14 pt-14 lg:flex-shrink-0">
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
        {(hasAnyText || availableImages.length > 1) && (
          <div className="mt-12 flex flex-col space-y-2 text-center lg:w-[350px] xl:w-[460px]">
            {legendExpanded && (
              <p className="font-display text-lg tracking-wider break-words text-slate-400 xl:text-xl">
                <FormattedLegendExpanded text={legendExpanded} />
              </p>
            )}

            {legendTranslation && (
              <p className="text-base break-words text-slate-400">
                {legendTranslation}
              </p>
            )}

            {description && (
              <div data-popover-container>
                <DescriptionWithDeviceHighlights
                  text={description}
                  devices={devices}
                  className="mt-2 text-base leading-relaxed break-words text-slate-400 italic"
                />
              </div>
            )}

            {flavourText && (
              <p className="mt-3 hidden text-base leading-relaxed break-words text-slate-400 lg:block">
                {flavourText}
              </p>
            )}

            {/* Switcher buttons for alternate images */}
            {availableImages.length > 1 && (
              <div className="mt-4 flex flex-row justify-center gap-2">
                {availableImages.map((image, index) => (
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
          </div>
        )}
      </div>

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
