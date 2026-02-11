"use client"

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
  /** Use purple accent instead of gold for auth pages */
  authPage?: boolean
  /** Full coin data for displaying coin flip information */
  coin?: CoinEnhanced | null
}

export function PageTitle({
  children,
  subtitle,
  className = "",
  authPage = false,
  coin,
}: PageTitleProps) {
  // Split the title into words and identify the last word for accent
  const words = children.trim().split(" ")
  const lastWordIndex = words.length - 1

  // If there's a subtitle, don't accent the main title - keep it all the same color
  const shouldAccentLastWord = !subtitle

  return (
    <div
      className={`mt-6 flex flex-col items-center text-center lg:mt-10 ${className}`}
    >
      <h1 className="text-2xl font-light tracking-wide text-slate-300 sm:text-3xl lg:text-4xl">
        {words.map((word, index) => {
          if (index === lastWordIndex && shouldAccentLastWord) {
            return (
              <span
                key={index}
                className={authPage ? "text-purple-400" : "heading-accent"}
              >
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
        <div className="mt-1 flex items-center justify-center gap-3 md:mt-4">
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

          <p className="text-lg text-slate-400">{subtitle}</p>

          {/* Laurel Wreath Icon with Tooltip for flavour text - RIGHT of denomination */}
          {coin?.flavour_text && (
            <TooltipLaurel
              ariaLabel="Show additional information"
              tooltipId="flavour-tooltip"
            >
              <div className="whitespace-pre-line">{coin.flavour_text}</div>
            </TooltipLaurel>
          )}
        </div>
      )}

      {/* Underline border - 300px wide */}
      <div className="mt-3 h-px w-[300px] bg-gradient-to-r from-transparent via-slate-600 to-transparent md:mt-5"></div>
    </div>
  )
}
