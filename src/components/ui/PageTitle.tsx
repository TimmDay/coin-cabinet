"use client"

import { useId } from "react"
import type { CoinEnhanced } from "~/types/api"
import { CoinFlipInfo } from "./CoinFlipInfo"
import { TooltipLaurel } from "./TooltipLaurel"

type PageTitleProps = {
  /** The main text of the title */
  children: string
  /** Optional subtitle text */
  subtitle?: string
  /** Additional CSS classes */
  className?: string
  /** Full coin data for displaying coin flip information */
  coin?: CoinEnhanced | null
  /** "somnus": Roman capitals, warm muted colours and a curved divider */
  variant?: "default" | "somnus"
}

// The somnus divider shares the homepage header's horizon curve: the centre
// stays put and the ends drop, like the top of a planet. SAG is how far the
// ends sit below the centre, in px.
const CURVE_WIDTH = 300
const SAG = 6

/** Divider line on the same curve, fading out at both ends like the flat one. */
function CurvedDivider() {
  const gradientId = useId().replace(/:/g, "")
  const endY = 1 + SAG

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CURVE_WIDTH} ${endY + 1}`}
      className="mt-1 h-[8px] w-[300px] md:mt-3"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#475569" stopOpacity="0" />
          <stop offset="0.5" stopColor="#475569" />
          <stop offset="1" stopColor="#475569" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${endY} Q${CURVE_WIDTH / 2},${endY - 2 * SAG} ${CURVE_WIDTH},${endY}`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1"
      />
    </svg>
  )
}

export function PageTitle({
  children,
  subtitle,
  className = "",
  coin,
  variant = "default",
}: PageTitleProps) {
  const isSomnus = variant === "somnus"

  // Split the title into words and identify the last word for accent
  const words = children.trim().split(" ")
  const lastWordIndex = words.length - 1

  // If there's a subtitle, don't accent the main title - keep it all the same color
  const shouldAccentLastWord = !subtitle

  return (
    <div
      className={`flex flex-col items-center text-center ${isSomnus ? "mt-3 lg:mt-5" : "mt-6 lg:mt-10"} ${className}`}
    >
      <h1
        className={
          isSomnus
            ? "font-display text-xl font-normal tracking-[0.2em] uppercase [text-shadow:0_1px_1px_hsl(228_20%_4%/0.7)] sm:text-2xl lg:text-3xl"
            : "text-2xl font-light tracking-wide sm:text-3xl lg:text-4xl"
        }
      >
        {words.map((word, index) => {
          if (index === lastWordIndex && shouldAccentLastWord) {
            return (
              <span key={index} className="text-subtitle">
                {word}
              </span>
            )
          }
          return (
            <span key={index}>
              {word}
              {index < lastWordIndex ? " " : ""}
            </span>
          )
        })}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <div
          className={`flex items-center justify-center gap-3 ${isSomnus ? "mt-0.5 md:mt-2" : "mt-1 md:mt-4"}`}
        >
          {/* Coin Flip Icon with Tooltip - LEFT of denomination */}
          {coin && (
            <TooltipLaurel
              ariaLabel="Show coin information"
              tooltipId="coin-flip-tooltip"
              widthClasses="w-56 sm:w-64"
            >
              <CoinFlipInfo coin={coin} />
            </TooltipLaurel>
          )}

          <p
            className={
              isSomnus
                ? "font-subtitle text-subtitle text-xl tracking-[0.04em]"
                : "text-lg text-slate-400"
            }
          >
            {subtitle}
          </p>

          {/* Laurel Wreath Icon with Tooltip for flavour text - RIGHT of denomination */}
          {coin?.flavour_tag && (
            <TooltipLaurel
              ariaLabel="Show additional information"
              tooltipId="flavour-tooltip"
            >
              <div className="whitespace-pre-line">{coin.flavour_tag}</div>
            </TooltipLaurel>
          )}
        </div>
      )}

      {isSomnus ? (
        <CurvedDivider />
      ) : (
        /* Underline border - 300px wide */
        <div className="mt-3 h-px w-[300px] bg-gradient-to-r from-transparent via-slate-600 to-transparent md:mt-5"></div>
      )}
    </div>
  )
}
