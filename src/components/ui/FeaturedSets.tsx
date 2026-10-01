"use client"

import { SetPreviewCard } from "./SetPreviewCard"

type FeaturedSet = {
  name: string
  href: string
  description: string
  /** One image, or several to pick from after the page loads */
  image?: string | readonly string[]
}

type FeaturedSetsProps = {
  title?: string
  sets: FeaturedSet[]
  className?: string
}

export function FeaturedSets({
  title = "Featured Sets",
  sets,
  className = "",
}: FeaturedSetsProps) {
  // Ensure exactly 3 sets are provided
  if (sets.length !== 3) {
    console.warn("FeaturedSets component expects exactly 3 sets")
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      <h2 className="mb-6 text-center text-2xl font-semibold">{title}</h2>

      {/* Three across from tablet up, a single stacked column below: never a
          2+1 wrap. auto-rows-fr keeps every card the same height. */}
      <div className="grid auto-rows-fr grid-cols-1 justify-items-center gap-4 md:grid-cols-3 lg:gap-8">
        {sets.map((set) => (
          <SetPreviewCard
            key={set.name}
            {...set}
            className="w-full max-w-[280px] sm:max-w-[300px]"
          />
        ))}
      </div>
    </div>
  )
}
