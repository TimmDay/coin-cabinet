/**
 * MintPin - A reverse teardrop-shaped pin for highlighting coin mints on the map
 * Used on coin detail pages to show the specific mint location for a coin
 */

type MintPinProps = {
  /** Size of the pin in pixels */
  size?: number
  /** Additional CSS classes */
  className?: string
  /** Optional label to show under the pin */
  label?: string
}

export function MintPin({ size = 24, className = "", label }: MintPinProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative h-6 w-6">
        {/* Simple circle design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className="drop-shadow-lg"
          >
            {/* Main circle */}
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="#a78bfa" // Light purple (purple-300)
              stroke="#7c3aed" // Darker purple outline (purple-600)
              strokeWidth="2"
            />

            {/* Inner circle for mint marker */}
            <circle
              cx="12"
              cy="12"
              r="5"
              fill="#8b5cf6" // Medium purple (purple-400)
            />

            {/* Small inner dot */}
            <circle cx="12" cy="12" r="2" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Optional label */}
      {label && (
        <div className="mt-1 text-center text-xs font-bold whitespace-nowrap text-purple-800">
          {label.toUpperCase()}
        </div>
      )}
    </div>
  )
}
