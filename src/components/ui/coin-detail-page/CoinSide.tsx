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

export function CoinSide({
  side,
  imageUrl,
  coinName,
  legend,
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
    <section className="flex flex-col items-center space-y-4">
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

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={imageUrl ?? undefined}
        alt={`${coinName} ${sideLabel} - Large View`}
      />

      {(legend ?? legendExpanded ?? legendTranslation ?? description) && (
        <div className="w-full max-w-[280px] space-y-2 text-center sm:max-w-[300px]">
          {legend && (
            <p className="text-sm font-medium break-words text-slate-400 uppercase sm:text-base">
              {legend}
            </p>
          )}
          {legendExpanded && (
            <p className="text-xs break-words text-slate-500 italic sm:text-sm">
              {legendExpanded}
            </p>
          )}
          {legendTranslation && (
            <p className="text-xs break-words text-slate-400 sm:text-sm">
              <span className="font-medium">Translation:</span>{" "}
              {legendTranslation}
            </p>
          )}
          {description && (
            <p className="text-xs break-words text-slate-500">{description}</p>
          )}
        </div>
      )}
    </section>
  )
}
