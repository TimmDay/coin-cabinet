"use client"

import { SetPreviewCard } from "./SetPreviewCard"

type FeaturedSet = {
  name: string
  href: string
  description: string
  image?: string
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

      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 lg:gap-8">
        {sets.map((set) => (
          <SetPreviewCard
            key={set.name}
            {...set}
            className="max-w-[280px] min-w-[200px] flex-1 sm:max-w-[300px] sm:min-w-[220px]"
          />
        ))}
      </div>
    </div>
  )
}
