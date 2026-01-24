"use client"

import { useViewport } from "~/hooks/useViewport"
import { formatPhysicalCharacteristicsCompact } from "~/lib/utils/physical-formatting"

type PageTitleProps = {
  /** The main text of the title */
  children: string
  /** Optional subtitle text */
  subtitle?: string
  /** Additional CSS classes */
  className?: string
  /** Use purple accent instead of gold for auth pages */
  authPage?: boolean
  /** Coin physical characteristics for mobile info display */
  coinPhysicalInfo?: {
    diameter?: number | null
    mass?: number | null
    dieAxis?: string | null
  }
}

export function PageTitle({
  children,
  subtitle,
  className = "",
  authPage = false,
  coinPhysicalInfo,
}: PageTitleProps) {
  const { isMobile } = useViewport()

  // Split the title into words and identify the last word for accent
  const words = children.trim().split(" ")
  const lastWordIndex = words.length - 1

  // If there's a subtitle, don't accent the main title - keep it all the same color
  const shouldAccentLastWord = !subtitle

  // Format physical characteristics for mobile display
  const physicalInfo = coinPhysicalInfo
    ? formatPhysicalCharacteristicsCompact(coinPhysicalInfo, " • ")
    : null

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
        <div className="mt-1 text-center md:mt-4">
          {/* Mobile: Subtitle and coin info on same line */}
          {isMobile && physicalInfo ? (
            <div className="flex flex-wrap items-center justify-center gap-2 text-lg">
              <span className="text-slate-400">{subtitle}</span>
              <span className="text-sm text-slate-400">{physicalInfo}</span>
            </div>
          ) : (
            <p className="text-lg text-slate-400">{subtitle}</p>
          )}
        </div>
      )}

      {/* Underline border - 300px wide */}
      <div className="mt-3 h-px w-[300px] bg-gradient-to-r from-transparent via-slate-600 to-transparent md:mt-5"></div>
    </div>
  )
}
