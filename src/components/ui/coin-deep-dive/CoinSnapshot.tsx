"use client"

import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristicsCompact } from "~/lib/utils/physical-formatting"

type CoinSnapshotProps = {
  civ: string
  civSpecific?: string | null
  mint?: string | null
  mintYearEarliest?: number | null
  mintYearLatest?: number | null
  diameter?: number | null
  mass?: number | null
  dieAxis?: string | null
  reference?: string | null
  provenance?: string | null
}

export function CoinSnapshot({
  civ,
  civSpecific,
  mint,
  mintYearEarliest,
  mintYearLatest,
  diameter,
  mass,
  dieAxis,
  reference,
  provenance,
}: CoinSnapshotProps) {
  // Build civilization text
  const civText = civSpecific
    ? `${civ.toUpperCase()}, ${civSpecific}`
    : civ.toUpperCase()

  // Build mint and year text
  const yearDisplay = formatYearRange(mintYearEarliest, mintYearLatest)
  const mintYearText = [mint, yearDisplay].filter(Boolean).join(" ")

  // Build specs line (diameter | mass | die axis) using utility function
  const specs = formatPhysicalCharacteristicsCompact({
    diameter,
    mass,
    dieAxis,
  })

  return (
    <div className="space-y-1 text-sm">
      <div className="font-semibold text-slate-400">{civText}</div>
      {mintYearText && <div className="text-slate-400">{mintYearText}</div>}
      {specs && <div className="text-slate-500">{specs}</div>}
      {reference && (
        <div className="font-mono text-xs text-slate-600">{reference}</div>
      )}
      {provenance && (
        <div className="text-xs text-slate-600 italic">{provenance}</div>
      )}
    </div>
  )
}
