"use client"

import { SegmentedControl } from "../ui/SegmentedControl"
import { TIERS, type Tier } from "./jurisdictions"

/**
 * Reader-facing names. The middle Tier is "admin areas" rather than
 * "provinces" because it holds the Augustan regiones of Italy alongside the
 * provinces proper.
 */
const LABELS: Record<Tier, string> = {
  realm: "Realms",
  province: "Admin areas",
  city: "Cities",
}

type TierControlProps = {
  value: Tier
  onChange: (tier: Tier) => void
  /**
   * Tiers holding at least one Jurisdiction at the Selected year. The rest are
   * disabled rather than hidden, so an empty Tier reads as a fact about that
   * year rather than as a missing feature. The Province Tier is genuinely
   * empty across most of the Byzantine range, because no open boundary data
   * exists for themes or dioceses.
   */
  available: Tier[]
  size?: "sm" | "md"
  className?: string
}

export function TierControl({
  value,
  onChange,
  available,
  size = "sm",
  className = "",
}: TierControlProps) {
  return (
    <SegmentedControl
      legend="Administrative tier"
      name="map-tier"
      size={size}
      className={className}
      value={value}
      onChange={onChange}
      options={TIERS.map((tier) => ({
        value: tier,
        label: LABELS[tier],
        disabled: !available.includes(tier),
        title: available.includes(tier)
          ? undefined
          : "Nothing mapped at this tier for this year",
      }))}
    />
  )
}
