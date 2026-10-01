"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"

type SetPreviewCardProps = {
  name: string
  href: string
  description: string
  image?: string
}

export function SetPreviewCard({
  name,
  href,
  description,
  image,
}: SetPreviewCardProps) {
  return (
    <Link
      href={href}
      className="group somnus-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Image or placeholder */}
      <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20">
        {image ? (
          <CldImage
            src={image}
            alt={`${name} collection preview`}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-sm font-medium text-amber-300/60">{name}</div>
        )}
      </div>

      <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-amber-300">
        {name}
      </h3>

      <p className="text-ink-muted text-sm leading-[1.7]">{description}</p>

      <div className="mt-4 text-sm font-medium text-amber-400 transition-colors group-hover:text-amber-300">
        Explore Collection →
      </div>
    </Link>
  )
}
