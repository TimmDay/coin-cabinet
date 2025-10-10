"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"
import { ImageModal } from "./ImageModal"

type CoinSideProps = {
  side: "obverse" | "reverse"
  imageUrl?: string | null
  coinName: string
  legend?: string | null
  legendExpanded?: string | null
  legendTranslation?: string | null
  description?: string | null
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

export function CoinSide({
  side,
  imageUrl,
  coinName,
  legend: _legend,
  legendExpanded,
  legendTranslation,
  description,
}: CoinSideProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sideLabel = side === "obverse" ? "Obverse" : "Reverse"

  const handleImageClick = () => {
    if (imageUrl) {
      setIsModalOpen(true)
    }
  }

  return (
    <section className="flex flex-col items-center">
      {/* Fixed height image area */}
      <div className="mb-4">
        <button
          onClick={handleImageClick}
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
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={imageUrl ?? undefined}
        alt={`${coinName} ${sideLabel} - Large View`}
      />

      {/* Fixed minimum height text area */}
      <div className="min-h-[120px] w-full max-w-[280px] space-y-2 text-center sm:min-h-[140px] sm:max-w-[300px]">
        {legendExpanded && (
          <p className="text-base tracking-wide break-words text-slate-400 sm:text-lg">
            <FormattedLegendExpanded text={legendExpanded} />
          </p>
        )}
        {legendTranslation && (
          <p className="text-xs break-words text-slate-400 sm:text-sm">
            {legendTranslation}
          </p>
        )}
        {description && (
          <p className="text-xs break-words text-slate-500">{description}</p>
        )}
      </div>
    </section>
  )
}
