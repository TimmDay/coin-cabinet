"use client"

import type { ReactNode } from "react"
import { useMints } from "~/api/mints"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristicsCompact } from "~/lib/utils/physical-formatting"
import type { CoinEnhanced } from "~/types/api"

type CoinFlipInfoProps = {
  coin: CoinEnhanced
  className?: string
}

/**
 * Displays formatted coin flip information including physical characteristics,
 * civilization, reference, mint, and minting year.
 */
export function CoinFlipInfo({ coin, className = "" }: CoinFlipInfoProps) {
  const { data: mints } = useMints()
  const lines: ReactNode[] = []

  // Line 1: diameter | mass | die axis
  const physicalInfo = formatPhysicalCharacteristicsCompact({
    diameter: coin.diameter,
    mass: coin.mass,
    dieAxis: coin.die_axis,
  })
  if (physicalInfo) lines.push(physicalInfo)

  // Line 2: civ (and civ_specific if available)
  if (coin.civ) {
    const civLine = coin.civ_specific
      ? `${coin.civ} (${coin.civ_specific})`
      : coin.civ
    lines.push(civLine)
  }

  // Line 3: reference
  if (coin.reference) {
    // Only a web address becomes a link; the column is free text.
    const link =
      coin.reference_link && /^https?:\/\//i.test(coin.reference_link)
    lines.push(
      link ? (
        <a
          href={coin.reference_link!}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-stone-900/40 underline-offset-4 hover:decoration-stone-900"
        >
          {coin.reference}
        </a>
      ) : (
        coin.reference
      ),
    )
  }

  // Line 4: Mint year and name (year first, then mint name on same line)
  let mintYearName = ""

  // Get mint year/range with AD/BCE formatting
  const yearDisplay = formatYearRange(
    coin.mint_year_earliest,
    coin.mint_year_latest,
  )
  if (yearDisplay) {
    // Remove parentheses from formatYearRange output
    mintYearName = yearDisplay.replace(/[()]/g, "")
  }

  // Get mint name
  if (coin.mint_id && mints) {
    const mint = mints.find((m) => m.id === coin.mint_id)
    if (mint?.name) {
      mintYearName = mintYearName ? `${mintYearName}  ${mint.name}` : mint.name
    }
  }

  if (mintYearName) lines.push(mintYearName)

  if (lines.length === 0) return null

  return (
    <div className={`leading-loose ${className}`}>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  )
}
