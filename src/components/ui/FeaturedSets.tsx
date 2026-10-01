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
      <h2 className="mb-6 text-center text-2xl font-semibold">{title}</h2>

      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 lg:gap-8">
        {sets.map((set) => (
          <Link
            key={set.name}
            href={set.href}
            className="group focus-visible:ring-bronze-light/70 max-w-[280px] min-w-[200px] flex-1 rounded-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100 sm:max-w-[300px] sm:min-w-[220px]"
          >
            <div className="bg-dusk border-dusk-edge/60 group-hover:border-bronze flex flex-col rounded-lg border p-4 transition-colors">
              <div className="from-dusk-edge/40 to-dusk mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br">
                {set.image ? (
                  <div className="relative h-full w-full">
                    <CldImage
                      src={set.image}
                      alt={`${set.name} collection preview`}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* 40% dark overlay to dim the image */}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                ) : (
                  <div className="text-bronze px-2 text-center text-sm font-medium">
                    {set.name}
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="group-hover:text-bronze-light mb-2 text-base tracking-widest uppercase transition-colors">
                  {set.name}
                </h3>
                <p className="text-ink/75 line-clamp-3 text-base leading-relaxed">
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
