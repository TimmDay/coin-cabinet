"use client"

import { TIERS, type Tier } from "./jurisdictions"

// The Province Tier holds more than provinces: the eleven Augustan regiones
// of Italy sit in it too, and later units would. "Administrative areas" is
// what it is; "Provinces" was only ever what most of it was.
const LABELS: Record<Tier, string> = {
  realm: "Realms",
  province: "Admin areas",
  city: "Cities",
}

type TierControlProps = {
  value: Tier
  onChange: (tier: Tier) => void
  /**
   * Tiers holding at least one Jurisdiction at the Selected year. Everything
   * else is disabled rather than hidden, so an empty Tier reads as a fact
   * about that year rather than as a missing feature. The Province Tier is
   * genuinely empty across most of the Byzantine range, because no open
   * boundary data exists for themes or dioceses.
   */
  available: Tier[]
  className?: string
}

export function TierControl({
  value,
  onChange,
  available,
  className = "",
}: TierControlProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-1 ${className}`}
      role="group"
      aria-label="Administrative tier"
    >
      {TIERS.map((tier) => {
        const enabled = available.includes(tier)
        const selected = tier === value

        return (
          <button
            key={tier}
            type="button"
            disabled={!enabled}
            aria-pressed={selected}
            onClick={() => onChange(tier)}
            title={enabled ? undefined : `Nothing mapped at this tier`}
            className={[
              "rounded border px-2 py-1 text-xs transition-colors",
              selected
                ? "border-map-label text-map-label font-medium"
                : "border-paper-edge text-paper-ink-muted",
              enabled
                ? "hover:text-paper-ink cursor-pointer"
                : "cursor-not-allowed opacity-40",
            ].join(" ")}
          >
            {LABELS[tier]}
          </button>
        )
      })}
    </div>
  )
}
