"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { FormattedLegendExpanded } from "~/components/FormattedLegendExpanded"
import { ImageModal } from "./ImageModal"

type CoinRowProps = {
  side: "obverse" | "reverse"
  imageLink: string
  imageLinkAltlight?: string | null
  imageLinkSketch?: string | null
  legendExpanded?: string | null
  legendTranslation?: string | null
  description?: string | null
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
  priority = false,
}: CoinRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string>("")
  const [modalImageAlt, setModalImageAlt] = useState<string>("")

  // State for mobile image switching
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0)

  const hasAnyText = Boolean(legendExpanded || legendTranslation || description)

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
      {/* Mobile: Single Image with Mini-Image Buttons */}
      <div className="flex flex-col space-y-4 md:hidden">
        {/* Images Section */}
        <div className="flex justify-center px-2">
          <div className="relative w-full max-w-md">
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
                    width={400}
                    height={400}
                    priority={priority && currentMobileImageIndex === 0}
                  />
                )}
              </div>
            </div>

            {/* Mini-image buttons for switching (only show if there are multiple images) */}
            {availableImages.length > 1 && (
              <div className="absolute top-2 right-2 flex translate-x-1/2 flex-col gap-1">
                {availableImages.map(
                  (image, index) =>
                    index !== currentMobileImageIndex && (
                      <button
                        key={index}
                        className="artemis-card flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-slate-600 transition-all duration-200 hover:border-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:outline-none"
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
                            width={44}
                            height={44}
                          />
                        </div>
                      </button>
                    ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Text content - full width on mobile */}
        {hasAnyText && (
          <div className="flex flex-col space-y-2 text-center">
            {legendExpanded && (
              <p className="text-lg tracking-wide break-words text-slate-400">
                <FormattedLegendExpanded text={legendExpanded} />
              </p>
            )}

            {legendTranslation && (
              <p className="text-xs break-words text-slate-400">
                {legendTranslation}
              </p>
            )}

            {description && (
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-400 italic">
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tablet/Medium: Side by side with text below on narrower screens */}
      <div className="hidden flex-col space-y-6 md:flex lg:hidden">
        {/* Images Section */}
        <div className="flex justify-center px-4">
          <div className="flex w-full max-w-2xl flex-wrap justify-center gap-3">
            {/* Count images to determine layout */}
            {(() => {
              const imageCount = [
                imageLink,
                imageLinkAltlight,
                imageLinkSketch,
              ].filter(Boolean).length
              const imageWidth =
                imageCount === 1
                  ? "w-full max-w-md"
                  : imageCount === 2
                    ? "w-[calc(50%-0.375rem)]"
                    : "w-[calc(33.333%-0.5rem)]"

              return (
                <>
                  {/* Main coin image */}
                  <div
                    className={`artemis-card flex aspect-square cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 ${imageWidth}`}
                    onClick={() =>
                      handleImageClick(imageLink, `${side} of coin`)
                    }
                  >
                    <div className="max-h-full max-w-full">
                      <CloudinaryImage
                        src={imageLink}
                        alt={`${side} of coin`}
                        width={400}
                        height={400}
                        priority={priority}
                      />
                    </div>
                  </div>

                  {/* Alternative lighting image (if available) */}
                  {imageLinkAltlight && (
                    <div
                      className={`artemis-card flex aspect-square cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 ${imageWidth}`}
                      onClick={() =>
                        handleImageClick(
                          imageLinkAltlight,
                          `${side} of coin (alternative lighting)`,
                        )
                      }
                    >
                      <div className="max-h-full max-w-full">
                        <CloudinaryImage
                          src={imageLinkAltlight}
                          alt={`${side} of coin (alternative lighting)`}
                          width={400}
                          height={400}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sketch image (if available) */}
                  {imageLinkSketch && (
                    <div
                      className={`artemis-card flex aspect-square cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 ${imageWidth}`}
                      onClick={() =>
                        handleImageClick(
                          imageLinkSketch,
                          `${side} sketch of coin`,
                        )
                      }
                    >
                      <div className="max-h-full max-w-full">
                        <CloudinaryImage
                          src={imageLinkSketch}
                          alt={`${side} sketch of coin`}
                          width={400}
                          height={400}
                        />
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>

        {/* Text content - wider section below images */}
        {hasAnyText && (
          <div className="mx-auto flex w-full max-w-2xl flex-col space-y-2 text-center">
            {legendExpanded && (
              <p className="text-lg tracking-wide break-words text-slate-400 xl:text-xl">
                <FormattedLegendExpanded text={legendExpanded} />
              </p>
            )}

            {legendTranslation && (
              <p className="text-xs break-words text-slate-400 sm:text-sm">
                {legendTranslation}
              </p>
            )}

            {description && (
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-400 italic">
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Flexible layout that wraps when constrained */}
      <div className="hidden flex-wrap items-center justify-center gap-8 lg:flex">
        {/* Images Section */}
        <div className="flex-shrink-0">
          <div className="flex flex-wrap gap-6">
            {/* Main coin image */}
            <div
              className="artemis-card flex h-[280px] w-[280px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 xl:h-[320px] xl:w-[320px]"
              onClick={() => handleImageClick(imageLink, `${side} of coin`)}
            >
              <div className="max-h-full max-w-full">
                <CloudinaryImage
                  src={imageLink}
                  alt={`${side} of coin`}
                  width={320}
                  height={320}
                  priority={priority}
                />
              </div>
            </div>

            {/* Alternative lighting image (if available) */}
            {imageLinkAltlight && (
              <div
                className="artemis-card flex h-[280px] w-[280px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 xl:h-[320px] xl:w-[320px]"
                onClick={() =>
                  handleImageClick(
                    imageLinkAltlight,
                    `${side} of coin (alternative lighting)`,
                  )
                }
              >
                <div className="max-h-full max-w-full">
                  <CloudinaryImage
                    src={imageLinkAltlight}
                    alt={`${side} of coin (alternative lighting)`}
                    width={320}
                    height={320}
                  />
                </div>
              </div>
            )}

            {/* Sketch image (if available) */}
            {imageLinkSketch && (
              <div
                className="artemis-card flex h-[280px] w-[280px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 xl:h-[320px] xl:w-[320px]"
                onClick={() =>
                  handleImageClick(imageLinkSketch, `${side} sketch of coin`)
                }
              >
                <div className="max-h-full max-w-full">
                  <CloudinaryImage
                    src={imageLinkSketch}
                    alt={`${side} sketch of coin`}
                    width={320}
                    height={320}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text content - width matches single coin image */}
        {hasAnyText && (
          <div className="flex w-[280px] flex-col justify-center space-y-2 text-center xl:w-[320px]">
            {legendExpanded && (
              <p className="text-lg tracking-wide break-words text-slate-400 xl:text-xl">
                <FormattedLegendExpanded text={legendExpanded} />
              </p>
            )}

            {legendTranslation && (
              <p className="text-xs break-words text-slate-400 sm:text-sm">
                {legendTranslation}
              </p>
            )}

            {description && (
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-400 italic">
                {description}
              </p>
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
