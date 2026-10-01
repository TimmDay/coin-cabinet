"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"

type SetPreviewCardProps = {
  name: string
  href: string
  description: string
  image?: string
  /** Show the whole description instead of clamping it to three lines */
  fullDescription?: boolean
  /** Sizing from the parent (a grid cell, or a flex item in a row) */
  className?: string
}

/**
 * A set's card: a near-black night surface with a grey edge, the set's image
 * (dimmed 40%), its name in Cinzel capitals and a short description. Used for
 * the Featured Sets on the homepage and the grid on /cabinet.
 */
export function SetPreviewCard({
  name,
  href,
  description,
  image,
  fullDescription = false,
  className = "",
}: SetPreviewCardProps) {
  return (
    <Link
      href={href}
      className={`group focus-visible:ring-moonlight/70 rounded-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100 ${className}`}
    >
      <div className="bg-night border-line group-hover:border-moonlight/50 flex h-full flex-col rounded-lg border p-4 transition-colors">
        <div className="from-line/50 to-field mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br">
          {image ? (
            <div className="relative h-full w-full">
              <CldImage
                src={image}
                alt={`${name} collection preview`}
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* 40% dark overlay to dim the image */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div className="text-moonlight px-2 text-center text-sm font-medium">
              {name}
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="mb-2 text-base tracking-widest uppercase">{name}</h3>
          <p
            className={`text-ink/75 text-base leading-relaxed ${fullDescription ? "" : "line-clamp-3"}`}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
