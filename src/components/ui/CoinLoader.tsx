type CoinLoaderProps = {
  /** Read out to screen readers; not shown. */
  label?: string
}

const COIN = 36
const TRACK = 240

/**
 * A coin rolling along a line, with a trail behind it like a progress bar.
 * The line is TRACK wide and the coin travels TRACK - COIN, turning
 * (TRACK - COIN) / (pi * COIN) times on the way (see `coin-spin` in
 * globals.css, 650deg). With reduced motion it stands still at the start.
 */
export function CoinLoader({ label = "Loading..." }: CoinLoaderProps) {
  return (
    <div role="status" className="flex flex-col items-center">
      <div
        aria-hidden="true"
        className="relative"
        style={
          {
            width: TRACK,
            height: COIN,
            "--coin-travel": `${TRACK - COIN}px`,
          } as React.CSSProperties
        }
      >
        {/* The line the coin rolls on, and the trail it leaves */}
        <div className="bg-line absolute right-0 bottom-0 left-0 h-px" />
        <div className="bg-bronze/70 animate-coin-trail absolute bottom-0 left-0 h-px w-full origin-left motion-reduce:hidden" />

        <div className="animate-coin-roll absolute bottom-0 left-0 motion-reduce:animate-none">
          <div className="animate-coin-fade motion-reduce:animate-none">
            <svg
              width={COIN}
              height={COIN}
              viewBox="0 0 36 36"
              className="animate-coin-spin motion-reduce:animate-none"
            >
              <defs>
                <radialGradient id="coin-loader-face" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="var(--color-bronze-light)" />
                  <stop offset="100%" stopColor="var(--color-bronze)" />
                </radialGradient>
              </defs>
              <circle cx="18" cy="18" r="17" fill="url(#coin-loader-face)" />
              {/* Beaded border */}
              <circle
                cx="18"
                cy="18"
                r="14.5"
                fill="none"
                stroke="var(--color-dusk)"
                strokeOpacity="0.55"
                strokeWidth="1.4"
                strokeDasharray="0.1 3.1"
                strokeLinecap="round"
              />
              {/* A crescent moon: its lopsided shape makes the turning easy to see */}
              <path
                d="M21 10.5 A8 8 0 1 0 21 25.5 A9 9 0 0 1 21 10.5 Z"
                fill="var(--color-dusk)"
                fillOpacity="0.7"
              />
            </svg>
          </div>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}
