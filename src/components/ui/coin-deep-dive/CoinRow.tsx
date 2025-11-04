"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { FormattedLegendExpanded } from "~/lib/components"
import { ImageModal } from "./ImageModal"

type CoinRowProps = {
  side: "obverse" | "reverse"
  imageLink: string
  imageLinkAltlight?: string | null
  imageLinkSketch?: string | null
  legendExpanded?: string | null
  legendTranslation?: string | null
  description?: string | null
}

export function CoinRow({
  side,
  imageLink,
  imageLinkAltlight,
  imageLinkSketch,
  legendExpanded,
  legendTranslation,
  description,
}: CoinRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string>("")
  const [modalImageAlt, setModalImageAlt] = useState<string>("")
  const hasAnyText = Boolean(legendExpanded || legendTranslation || description)

  const handleImageClick = (imageUrl: string, altText: string) => {
    setModalImageUrl(imageUrl)
    setModalImageAlt(altText)
    setIsModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Mobile: Full Stack Layout */}
      <div className="flex flex-col space-y-4 md:hidden">
        {/* Images Section */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {/* Main coin image */}
            <div
              className="artemis-card flex h-[200px] w-[200px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 sm:h-[240px] sm:w-[240px]"
              onClick={() => handleImageClick(imageLink, `${side} of coin`)}
            >
              <div className="max-h-full max-w-full">
                <CloudinaryImage
                  src={imageLink}
                  alt={`${side} of coin`}
                  width={240}
                  height={240}
                />
              </div>
            </div>

            {/* Alternative lighting image (if available) */}
            {imageLinkAltlight && (
              <div
                className="artemis-card flex h-[200px] w-[200px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 sm:h-[240px] sm:w-[240px]"
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
                    width={240}
                    height={240}
                  />
                </div>
              </div>
            )}

            {/* Sketch image (if available) */}
            {imageLinkSketch && (
              <div
                className="artemis-card flex h-[200px] w-[200px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 sm:h-[240px] sm:w-[240px]"
                onClick={() =>
                  handleImageClick(imageLinkSketch, `${side} sketch of coin`)
                }
              >
                <div className="max-h-full max-w-full">
                  <CloudinaryImage
                    src={imageLinkSketch}
                    alt={`${side} sketch of coin`}
                    width={240}
                    height={240}
                  />
                </div>
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
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-300 italic">
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tablet/Medium: Side by side with text below on narrower screens */}
      <div className="hidden flex-col space-y-6 md:flex lg:hidden">
        {/* Images Section */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-4">
            {/* Main coin image */}
            <div
              className="artemis-card flex h-[240px] w-[240px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105"
              onClick={() => handleImageClick(imageLink, `${side} of coin`)}
            >
              <div className="max-h-full max-w-full">
                <CloudinaryImage
                  src={imageLink}
                  alt={`${side} of coin`}
                  width={240}
                  height={240}
                />
              </div>
            </div>

            {/* Alternative lighting image (if available) */}
            {imageLinkAltlight && (
              <div
                className="artemis-card flex h-[240px] w-[240px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105"
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
                    width={240}
                    height={240}
                  />
                </div>
              </div>
            )}

            {/* Sketch image (if available) */}
            {imageLinkSketch && (
              <div
                className="artemis-card flex h-[240px] w-[240px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105"
                onClick={() =>
                  handleImageClick(imageLinkSketch, `${side} sketch of coin`)
                }
              >
                <div className="max-h-full max-w-full">
                  <CloudinaryImage
                    src={imageLinkSketch}
                    alt={`${side} sketch of coin`}
                    width={240}
                    height={240}
                  />
                </div>
              </div>
            )}
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
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-300 italic">
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

        {/* Text content - flexible width that maintains minimum but can wrap */}
        {hasAnyText && (
          <div className="flex max-w-[480px] min-w-[300px] flex-1 flex-col justify-center space-y-2 text-center">
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
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-300 italic">
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
