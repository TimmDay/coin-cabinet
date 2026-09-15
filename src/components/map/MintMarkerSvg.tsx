/**
 * SVG component for highlighted mint markers (purple circular design)
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
                fill="#a78bfa"
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="5" fill="#8b5cf6" />
              <circle cx="12" cy="12" r="2" fill="#ffffff" />
            </svg>
          </div>
        </div>
        <div className="text-map-label mt-1 text-center text-xs font-bold whitespace-nowrap uppercase">
          {displayName}
        </div>
      </div>
    </div>
  )
}
