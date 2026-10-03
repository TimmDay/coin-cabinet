import { cssColor } from "./mapColors"

/**
 * SVG component for highlighted mint markers (sunset circular design)
 * Used when a specific mint is highlighted on coin detail pages
 */
export function HighlightedMintSvg({ displayName }: { displayName: string }) {
  return (
    <div className="mint-pin-wrapper" data-mint={displayName}>
      <div className="flex flex-col items-center">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="drop-shadow-lg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill={cssColor("pin-orange-soft")}
                stroke={cssColor("pin-wine")}
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="5" fill={cssColor("pin-sienna")} />
              <circle cx="12" cy="12" r="2" fill={cssColor("pin-cream")} />
            </svg>
          </div>
        </div>
        <div className="font-display text-map-ink mt-1 text-center text-xs font-bold tracking-[0.06em] whitespace-nowrap uppercase">
          {displayName}
        </div>
      </div>
    </div>
  )
}
