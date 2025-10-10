"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { ImageModal } from "./ImageModal"

type CoinImagePanelProps = {
  coin: {
    nickname?: string | null
    image_link_o?: string | null
    image_link_r?: string | null
    legend_o?: string | null
    legend_o_expanded?: string | null
    legend_o_translation?: string | null
    desc_o?: string | null
    legend_r?: string | null
    legend_r_expanded?: string | null
    legend_r_translation?: string | null
    desc_r?: string | null
  }
}

function FormattedLegendExpanded({ text }: { text: string }) {
  // Split the text by parentheses while keeping the delimiters
  const parts = text.split(/(\([^)]*\))/)
  const parenthesesRegex = /^\([^)]*\)$/

  return (
    <span>
      {parts.map((part, index) => {
        if (parenthesesRegex.exec(part)) {
          // This is text within parentheses - remove the parentheses and apply special formatting
          const innerText = part.slice(1, -1) // Remove the parentheses
          return (
            <span key={index} className="font-normal lowercase">
              {innerText}
            </span>
          )
        } else {
          // This is regular text - apply normal formatting (uppercase, bold)
          return (
            <span key={index} className="font-bold uppercase">
              {part}
            </span>
          )
        }
      })}
    </span>
  )
}

type CoinSideData = {
  imageUrl?: string | null
  legendExpanded?: string | null
  legendTranslation?: string | null
  description?: string | null
}

function CoinImageButton({
  side,
  imageUrl,
  coinName,
  onImageClick,
}: {
  side: "obverse" | "reverse"
  imageUrl?: string | null
  coinName: string
  onImageClick: () => void
}) {
  return (
    <button
      onClick={onImageClick}
      className="artemis-card flex h-[280px] w-[280px] cursor-pointer items-center justify-center p-4 transition-transform hover:scale-105 focus:ring-2 focus:ring-slate-400 focus:outline-none active:scale-95 sm:h-[300px] sm:w-[300px]"
      aria-label={`View larger image of ${coinName} ${side}`}
      disabled={!imageUrl}
    >
      <div className="max-h-full max-w-full">
        <CloudinaryImage
          src={imageUrl ?? undefined}
          width={280}
          height={280}
          alt={`${coinName} ${side}`}
        />
      </div>
    </button>
  )
}

export function CoinImagePanel({ coin }: CoinImagePanelProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    side: "obverse" | "reverse" | null
  }>({ isOpen: false, side: null })

  const coinName = coin.nickname ?? "Ancient Coin"

  const handleImageClick = (side: "obverse" | "reverse") => {
    setModalState({ isOpen: true, side })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, side: null })
  }

  const obverseData: CoinSideData = {
    imageUrl: coin.image_link_o,
    legendExpanded: coin.legend_o_expanded,
    legendTranslation: coin.legend_o_translation,
    description: coin.desc_o,
  }

  const reverseData: CoinSideData = {
    imageUrl: coin.image_link_r,
    legendExpanded: coin.legend_r_expanded,
    legendTranslation: coin.legend_r_translation,
    description: coin.desc_r,
  }

  const currentModalImageUrl =
    modalState.side === "obverse" ? coin.image_link_o : coin.image_link_r

  return (
    <section className="space-y-6">
      {/* Mobile: Stacked Layout - Each image followed by its legend */}
      <div className="block space-y-8 sm:hidden">
        {/* Obverse Side */}
        <div className="flex flex-col items-center space-y-4">
          <CoinImageButton
            side="obverse"
            imageUrl={obverseData.imageUrl}
            coinName={coinName}
            onImageClick={() => handleImageClick("obverse")}
          />
          <div className="mx-auto w-full max-w-[280px] space-y-2 text-center">
            {obverseData.legendExpanded && (
              <p className="text-base tracking-wide break-words text-slate-400 sm:text-lg">
                <FormattedLegendExpanded text={obverseData.legendExpanded} />
              </p>
            )}
            {obverseData.legendTranslation && (
              <p className="text-xs break-words text-slate-400 sm:text-sm">
                {obverseData.legendTranslation}
              </p>
            )}
            {obverseData.description && (
              <p className="text-xs break-words text-slate-500">
                {obverseData.description}
              </p>
            )}
          </div>
        </div>

        {/* Reverse Side */}
        <div className="flex flex-col items-center space-y-4">
          <CoinImageButton
            side="reverse"
            imageUrl={reverseData.imageUrl}
            coinName={coinName}
            onImageClick={() => handleImageClick("reverse")}
          />
          <div className="mx-auto w-full max-w-[280px] space-y-2 text-center">
            {reverseData.legendExpanded && (
              <p className="text-base tracking-wide break-words text-slate-400 sm:text-lg">
                <FormattedLegendExpanded text={reverseData.legendExpanded} />
              </p>
            )}
            {reverseData.legendTranslation && (
              <p className="text-xs break-words text-slate-400 sm:text-sm">
                {reverseData.legendTranslation}
              </p>
            )}
            {reverseData.description && (
              <p className="text-xs break-words text-slate-500">
                {reverseData.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Aligned Grid Layout - Images in one row, legends align in their rows */}
      <div className="hidden grid-cols-2 gap-4 sm:grid">
        {/* Row 1: Images */}
        <div className="flex justify-center">
          <CoinImageButton
            side="obverse"
            imageUrl={obverseData.imageUrl}
            coinName={coinName}
            onImageClick={() => handleImageClick("obverse")}
          />
        </div>

        <div className="flex justify-center">
          <CoinImageButton
            side="reverse"
            imageUrl={reverseData.imageUrl}
            coinName={coinName}
            onImageClick={() => handleImageClick("reverse")}
          />
        </div>

        {/* Row 2: Legend Expanded - both take same height */}
        <div className="mx-auto w-full max-w-[300px] text-center">
          {obverseData.legendExpanded && (
            <p className="text-base tracking-wide break-words text-slate-400 sm:text-lg">
              <FormattedLegendExpanded text={obverseData.legendExpanded} />
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-[300px] text-center">
          {reverseData.legendExpanded && (
            <p className="text-base tracking-wide break-words text-slate-400 sm:text-lg">
              <FormattedLegendExpanded text={reverseData.legendExpanded} />
            </p>
          )}
        </div>

        {/* Row 3: Translation - both take same height */}
        <div className="mx-auto w-full max-w-[300px] text-center">
          {obverseData.legendTranslation && (
            <p className="text-xs break-words text-slate-400 sm:text-sm">
              {obverseData.legendTranslation}
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-[300px] text-center">
          {reverseData.legendTranslation && (
            <p className="text-xs break-words text-slate-400 sm:text-sm">
              {reverseData.legendTranslation}
            </p>
          )}
        </div>

        {/* Row 4: Description - both take same height */}
        <div className="mx-auto w-full max-w-[300px] text-center">
          {obverseData.description && (
            <p className="text-xs break-words text-slate-500">
              {obverseData.description}
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-[300px] text-center">
          {reverseData.description && (
            <p className="text-xs break-words text-slate-500">
              {reverseData.description}
            </p>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageUrl={currentModalImageUrl ?? undefined}
        alt={`${coinName} ${modalState.side} - Large View`}
      />
    </section>
  )
}
