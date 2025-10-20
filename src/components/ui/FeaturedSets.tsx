"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"

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
      <h2 className="mb-6 text-center text-2xl font-semibold text-slate-300">
        {title}
      </h2>

      <div className="flex items-start justify-center gap-4 sm:gap-6 lg:gap-8">
        {sets.map((set) => (
          <Link
            key={set.name}
            href={set.href}
            className="group max-w-[150px] flex-1 transition-transform hover:scale-105 sm:max-w-[180px] lg:max-w-[200px]"
          >
            <div className="flex flex-col rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 transition-colors hover:border-slate-600/70">
              <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20">
                {set.image ? (
                  <CldImage
                    src={set.image}
                    alt={`${set.name} collection preview`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="px-2 text-center text-sm font-medium text-amber-300/60">
                    {set.name}
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="mb-2 text-sm font-medium text-slate-300">
                  {set.name}
                </p>
                <p className="line-clamp-3 text-xs leading-relaxed text-slate-400">
                  {set.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
