/**
 * SVG component for high        <div className="mt      <div class="text-xs font-bold text-map-label mt-1 text-center whitespace-nowrap uppercase">
        ${displayName}
      </div>text-center text-xs font-bold whitespace-nowrap text-map-label uppercase">
          {displayName}
        </div>hted mint markers (purple circular design)
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

/**
 * Generate HTML string for highlighted mint marker (for use in Leaflet DivIcon)
 * This is needed because Leaflet DivIcon requires HTML strings, not JSX
 */
export function createHighlightedMintHtml(displayName: string): string {
  return `<div class="mint-pin-wrapper" data-mint="${displayName}">
    <div class="flex flex-col items-center">
      <div class="relative w-6 h-6">
        <div class="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" class="drop-shadow-lg">
            <circle cx="12" cy="12" r="10" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" fill="#8b5cf6"/>
            <circle cx="12" cy="12" r="2" fill="#ffffff"/>
          </svg>
        </div>
      </div>
      <div class="text-xs font-bold text-map-label mt-1 text-center whitespace-nowrap uppercase">
        ${displayName}
      </div>
    </div>
  </div>`
}
