import { useMints } from "~/api/mints"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristicsCompact } from "~/lib/utils/physical-formatting"

type CoinSnapshotProps = {
  civ: string
  civSpecific?: string | null
  mintId?: number | null
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
  mintId,
  mintYearEarliest,
  mintYearLatest,
  diameter,
  mass,
  dieAxis,
  reference,
  provenance,
}: CoinSnapshotProps) {
  const { data: mints } = useMints()

  // Get mint name from mint_id lookup
  const mint =
    mintId && mints ? mints.find((m) => m.id === mintId)?.name : undefined
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
