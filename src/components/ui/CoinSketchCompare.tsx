"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { FormattedLegendExpanded } from "~/lib/components"
import { ImageModal } from "./coin-deep-dive/ImageModal"

type CoinSketchCompareProps = {
  imageLinkO: string
  imageLinkSketchO?: string | null
  imageLinkR: string
  imageLinkSketchR?: string | null
  legendExpandedO?: string | null
  legendTranslationO?: string | null
  legendExpandedR?: string | null
  legendTranslationR?: string | null
  descO?: string | null
  descR?: string | null
}

function CoinImagePair({
  mainImage,
  sketchImage,
  side,
  legendExpanded,
  legendTranslation,
  description,
}: {
  mainImage: string
  sketchImage?: string | null
  side: "obverse" | "reverse"
  legendExpanded?: string | null
  legendTranslation?: string | null
  description?: string | null
}) {
  const hasSketch = sketchImage != null

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Images Section */}
      <div className="flex justify-center">
        <div className="group flex gap-4">
          <div className="artemis-card flex h-[200px] w-[200px] items-center justify-center transition-transform duration-200 group-hover:scale-105 sm:h-[240px] sm:w-[240px]">
            <div className="max-h-full max-w-full">
              <CloudinaryImage
                src={mainImage}
                width={240}
                height={240}
                alt={`Coin ${side}`}
              />
            </div>
          </div>
          {hasSketch && (
            <div className="artemis-card flex h-[200px] w-[200px] items-center justify-center transition-transform duration-200 group-hover:scale-105 sm:h-[240px] sm:w-[240px]">
              <div className="max-h-full max-w-full">
                <CloudinaryImage
                  src={sketchImage}
                  width={240}
                  height={240}
                  alt={`Coin ${side} sketch`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend Section - Takes remaining space */}
      <div className="mx-auto flex w-full max-w-[480px] flex-grow flex-col justify-start space-y-2 text-center">
        {legendExpanded && (
          <p className="text-lg tracking-wide break-words text-slate-400 sm:text-xl">
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
    </div>
  )
}

export function CoinSketchCompare({
  imageLinkO,
  imageLinkSketchO,
  imageLinkR,
  imageLinkSketchR,
  legendExpandedO,
  legendTranslationO,
  legendExpandedR,
  legendTranslationR,
  descO,
  descR,
}: CoinSketchCompareProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSide, setModalSide] = useState<"obverse" | "reverse">("obverse")

  const handleImageClick = (side: "obverse" | "reverse") => {
    setModalSide(side)
    setIsModalOpen(true)
  }
  return (
    <>
      <section className="space-y-8">
        {/* Mobile: Stacked Layout */}
        <div className="block space-y-8 lg:hidden">
          {/* Obverse Side */}
          <div>
            <CoinImagePair
              mainImage={imageLinkO}
              sketchImage={imageLinkSketchO}
              side="obverse"
              legendExpanded={legendExpandedO}
              legendTranslation={legendTranslationO}
              description={descO}
            />
          </div>

          {/* Reverse Side */}
          <div>
            <CoinImagePair
              mainImage={imageLinkR}
              sketchImage={imageLinkSketchR}
              side="reverse"
              legendExpanded={legendExpandedR}
              legendTranslation={legendTranslationR}
              description={descR}
            />
          </div>
        </div>

        {/* Desktop: Side-by-Side Layout with Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto_auto] lg:items-center lg:gap-x-6 lg:gap-y-4">
          {/* Row 1: Obverse Images */}
          <div className="flex justify-center">
            <div
              className="group flex cursor-pointer gap-4"
              onClick={() => handleImageClick("obverse")}
            >
              <div className="artemis-card flex h-[240px] w-[240px] items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <div className="max-h-full max-w-full">
                  <CloudinaryImage
                    src={imageLinkO}
                    width={240}
                    height={240}
                    alt="Coin obverse"
                  />
                </div>
              </div>
              {imageLinkSketchO && (
                <div className="artemis-card flex h-[240px] w-[240px] items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <div className="max-h-full max-w-full">
                    <CloudinaryImage
                      src={imageLinkSketchO}
                      width={240}
                      height={240}
                      alt="Coin obverse sketch"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 1: Reverse Images */}
          <div className="flex justify-center">
            <div
              className="group flex cursor-pointer gap-4"
              onClick={() => handleImageClick("reverse")}
            >
              <div className="artemis-card flex h-[240px] w-[240px] items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <div className="max-h-full max-w-full">
                  <CloudinaryImage
                    src={imageLinkR}
                    width={240}
                    height={240}
                    alt="Coin reverse"
                  />
                </div>
              </div>
              {imageLinkSketchR && (
                <div className="artemis-card flex h-[240px] w-[240px] items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <div className="max-h-full max-w-full">
                    <CloudinaryImage
                      src={imageLinkSketchR}
                      width={240}
                      height={240}
                      alt="Coin reverse sketch"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Obverse Legend Expanded */}
          <div className="mx-auto w-full max-w-[480px] self-center text-center">
            {legendExpandedO && (
              <p className="text-lg tracking-wide break-words text-slate-400 lg:text-xl">
                <FormattedLegendExpanded text={legendExpandedO} />
              </p>
            )}
          </div>

          {/* Row 2: Reverse Legend Expanded */}
          <div className="mx-auto w-full max-w-[480px] self-center text-center">
            {legendExpandedR && (
              <p className="text-lg tracking-wide break-words text-slate-400 lg:text-xl">
                <FormattedLegendExpanded text={legendExpandedR} />
              </p>
            )}
          </div>

          {/* Row 3: Obverse Legend Translation */}
          <div className="mx-auto w-full max-w-[480px] self-center text-center">
            {legendTranslationO && (
              <p className="text-xs break-words text-slate-400 lg:text-sm">
                {legendTranslationO}
              </p>
            )}
          </div>

          {/* Row 3: Reverse Legend Translation */}
          <div className="mx-auto w-full max-w-[480px] self-center text-center">
            {legendTranslationR && (
              <p className="text-xs break-words text-slate-400 lg:text-sm">
                {legendTranslationR}
              </p>
            )}
          </div>

          {/* Row 4: Obverse Description */}
          <div className="mx-auto w-full max-w-[480px] self-center text-center">
            {descO && (
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-300 italic">
                {descO}
              </p>
            )}
          </div>

          {/* Row 4: Reverse Description */}
          <div className="mx-auto w-full max-w-[480px] self-center text-center">
            {descR && (
              <p className="mt-2 text-sm leading-relaxed break-words text-slate-300 italic">
                {descR}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        variant="pair"
        imageUrl1={modalSide === "obverse" ? imageLinkO : imageLinkR}
        imageUrl2={
          modalSide === "obverse"
            ? (imageLinkSketchO ?? undefined)
            : (imageLinkSketchR ?? undefined)
        }
        alt1={`Coin ${modalSide}`}
        alt2={`Coin ${modalSide} sketch`}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
