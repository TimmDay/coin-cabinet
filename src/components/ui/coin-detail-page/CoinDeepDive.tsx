"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { ImageModal } from "./ImageModal"

type CoinDeepDiveProps = {
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
    civ: string
    civ_specific?: string | null
    denomination: string
    mint?: string | null
    mint_year_earliest?: number | null
    mint_year_latest?: number | null
    diameter?: number | null
    mass?: number | null
    die_axis?: string | null
    reference?: string | null
    provenance?: string | null
    sets?: string[] | null
    flavour_text?: string | null
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

function CoinDetailsSection({ coin }: { coin: CoinDeepDiveProps["coin"] }) {
  // Build civilization text
  const civText = coin.civ_specific
    ? `${coin.civ.toUpperCase()}-${coin.civ_specific}`
    : coin.civ.toUpperCase()

  // Build mint and year text using the utility function
  const mintText = coin.mint
  const yearDisplay = formatYearRange(
    coin.mint_year_earliest,
    coin.mint_year_latest,
  )
  const yearText = yearDisplay || null

  // Build specs line (diameter | mass | die axis) - excluding reference
  const specs = [
    coin.diameter ? `${coin.diameter}mm` : null,
    coin.mass ? `${coin.mass}g` : null,
    coin.die_axis,
  ].filter(Boolean)

  return (
    <section className="artemis-card h-fit p-4">
      <div className="space-y-1 text-center">
        {/* Line 1: [Mint] ([mint year]) [denomination] | [diameter] | [mass] | [die axis] */}
        <div className="tracking-wide">
          {mintText && (
            <span className="mr-1 text-sm text-slate-400">{mintText}</span>
          )}
          {yearText && (
            <span className="mr-2 text-sm text-slate-400">{yearText}</span>
          )}
          <span className="text-lg font-medium text-slate-200">
            {coin.denomination.toUpperCase()}
          </span>
          {specs.length > 0 && (
            <span className="ml-2 text-sm text-slate-500">
              {specs.join(" | ")}
            </span>
          )}
        </div>

        {/* Line 2: [civ][-civ_specific] [reference] */}
        <div className="text-sm text-slate-400">
          {civText}
          {coin.reference && (
            <span className="ml-2 text-slate-500">{coin.reference}</span>
          )}
        </div>
      </div>

      {coin.flavour_text && (
        <footer className="mt-4 border-t border-slate-600 pt-4">
          <p className="text-xs leading-relaxed break-words text-slate-400 italic">
            {coin.flavour_text}
          </p>
        </footer>
      )}
    </section>
  )
}

function MapPlaceholder() {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-slate-600 bg-slate-700 p-6 lg:h-[300px]">
      <div className="text-center">
        <div className="mb-2 text-lg font-medium text-slate-300">
          Future Map
        </div>
        <div className="text-sm text-slate-500">
          Roman Empire & Mint Locations
        </div>
      </div>
    </div>
  )
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
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
      {/* Mobile: Stacked Layout */}
      <div className="block space-y-8 lg:hidden">
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

        {/* Mobile: Map Placeholder */}
        <MapPlaceholder />

        {/* Mobile: Coin Details */}
        <CoinDetailsSection coin={coin} />
      </div>

      {/* Desktop: Single Unified Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
        {/* Row 1: Coin Images + Map */}
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

        <div className="col-span-2">
          <MapPlaceholder />
        </div>

        {/* Row 2: Legends + Details */}
        <div className="mx-auto w-full max-w-[300px] space-y-2 text-center">
          {obverseData.legendExpanded && (
            <p className="text-base tracking-wide break-words text-slate-400 lg:text-lg">
              <FormattedLegendExpanded text={obverseData.legendExpanded} />
            </p>
          )}
          {obverseData.legendTranslation && (
            <p className="text-xs break-words text-slate-400 lg:text-sm">
              {obverseData.legendTranslation}
            </p>
          )}
          {obverseData.description && (
            <p className="text-xs break-words text-slate-500">
              {obverseData.description}
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-[300px] space-y-2 text-center">
          {reverseData.legendExpanded && (
            <p className="text-base tracking-wide break-words text-slate-400 lg:text-lg">
              <FormattedLegendExpanded text={reverseData.legendExpanded} />
            </p>
          )}
          {reverseData.legendTranslation && (
            <p className="text-xs break-words text-slate-400 lg:text-sm">
              {reverseData.legendTranslation}
            </p>
          )}
          {reverseData.description && (
            <p className="text-xs break-words text-slate-500">
              {reverseData.description}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <CoinDetailsSection coin={coin} />
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
