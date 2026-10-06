"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useEffect, useState } from "react"

type SetPreviewCardProps = {
  name: string
  href: string
  description: string
  /**
   * The set's image, or a list to choose from. With a list, the first is
   * shown on the server and on the first client render (so they match), and
   * a random one replaces it after the page loads.
   */
  image?: string | readonly string[]
  /** Show the whole description instead of clamping it to three lines */
  fullDescription?: boolean
  /** Sizing from the parent (a grid cell, or a flex item in a row) */
  className?: string
}

/**
 * A set's card: a near-black night surface with a grey edge, the set's image
 * (dimmed 40%), its name in Cinzel capitals and a short description (always
 * three lines tall unless fullDescription, so cards match however little text
 * one has). Used for
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
  const candidates = typeof image === "string" ? [image] : (image ?? [])
  const [shown, setShown] = useState<string | undefined>(candidates[0])
  // With several candidates, hold the image back until the random pick is
  // made, so it never visibly swaps from one picture to another.
  const [ready, setReady] = useState(candidates.length <= 1)

  useEffect(() => {
    if (candidates.length > 1) {
      // Random, so it must not run during render: the server would pick a
      // different picture from the client and the two would not match.
      /* eslint-disable react-hooks/set-state-in-effect */
      setShown(candidates[Math.floor(Math.random() * candidates.length)])
      setReady(true)
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    // candidates comes from a constant list, so its length is the only input;
    // depending on the array itself would reshuffle the picture every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates.length])

  return (
    <Link
      href={href}
      className={`group focus-visible:ring-moonlight/70 rounded-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100 ${className}`}
    >
      <div className="bg-night border-line group-hover:border-moonlight/50 flex h-full flex-col rounded-lg border p-4 transition-colors">
        <div className="from-line/50 to-field mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br">
          {shown ? (
            <div className="relative h-full w-full">
              <CldImage
                src={shown}
                alt={`${name} collection preview`}
                width={400}
                height={400}
                className={`h-full w-full object-cover transition-[transform,opacity] duration-300 group-hover:scale-105 ${ready ? "opacity-100" : "opacity-0"}`}
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
            className={`text-ink/75 text-base leading-relaxed ${fullDescription ? "" : "line-clamp-3 min-h-[4.875rem]"}`}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
