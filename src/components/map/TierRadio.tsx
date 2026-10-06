"use client"

import { useId } from "react"
import type { Tier } from "./jurisdictions"

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

type TierRadioProps = {
  value: Tier
  onChange: (tier: Tier) => void
  /** Which Tiers to offer, in order. */
  options?: Tier[]
  className?: string
}

/**
 * A small Tier chooser that sits over the map itself, for pages with no room
 * for a control panel.
 *
 * Native radios rather than buttons: arrow-key navigation, group semantics and
 * the one-of-many relationship all come for free, and screen readers announce
 * the position in the set. It wears a paper card over the map so the text
 * stays at 11.37:1 whatever the terrain underneath is doing.
 */
export function TierRadio({
  value,
  onChange,
  options = ["realm", "province"],
  className = "",
}: TierRadioProps) {
  const name = useId()

  return (
    <fieldset
      className={`border-paper-edge bg-paper/95 pointer-events-auto rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm ${className}`}
    >
      <legend className="sr-only">Map detail</legend>
      <div className="flex flex-col gap-1">
        {options.map((tier) => (
          <label
            key={tier}
            className="text-paper-ink flex cursor-pointer items-center gap-2 text-xs"
          >
            <input
              type="radio"
              name={name}
              value={tier}
              checked={value === tier}
              onChange={() => onChange(tier)}
              className="border-paper-edge text-map-label focus-visible:outline-paper-ink h-3.5 w-3.5 focus-visible:outline-2 focus-visible:outline-offset-2"
            />
            {LABELS[tier]}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
