"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"

export type CarouselImage = {
  /** Cloudinary public id or URL. */
  src: string
  alt: string
  /** What the picture is of (an artifact's name), shown under it. */
  name?: string
  /** Where it is (an artifact's location note). */
  location?: string
  /** Free text under the picture. */
  caption?: string
  /** Who to credit for the picture. */
  credit?: string
}

type ImageCarouselProps = {
  images: CarouselImage[]
}

/**
 * One image, or several to step through: clicking the picture shows the next
 * (and wraps), and the dots below jump to one. The alt text appears on hover and
 * one line of caption sits directly under the picture, for whichever image is
 * showing.
 */
export function ImageCarousel({ images }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)

  const current = images[Math.min(index, images.length - 1)]
  if (!current) return null

  const many = images.length > 1

  // One line: what it is, where it is, any caption, then the credit
  const caption = [
    current.name,
    current.location,
    current.caption,
    current.credit && `Image: ${current.credit}`,
  ]
    .filter(Boolean)
    .join(" · ")

  const picture = (
    <CloudinaryImage
      src={current.src}
      alt={current.alt}
      width={400}
      height={400}
      fit
    />
  )

  return (
    <div className="flex w-full flex-col items-center">
      <div className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg shadow-sm">
        {many ? (
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="focus-visible:ring-moonlight/70 cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`${current.alt}: image ${index + 1} of ${images.length}. Show the next image`}
          >
            {picture}
          </button>
        ) : (
          picture
        )}
        {/* Alt text on hover */}
        {current.alt && (
          <div className="bg-night/95 text-moonlight-bright pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg px-3 py-2 text-sm opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            <div className="text-center whitespace-pre-line">{current.alt}</div>
            <div className="border-t-night/95 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"></div>
          </div>
        )}
      </div>

      {caption && (
        <p className="text-moonlight mt-2 text-center text-sm leading-snug">
          {caption}
        </p>
      )}

      {many && (
        <div
          className="mt-3 flex gap-2"
          role="group"
          aria-label="Choose an image"
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2.5 w-2.5 cursor-pointer rounded-full border transition-colors ${
                i === index
                  ? "border-moonlight bg-moonlight"
                  : "border-moonlight/60 hover:bg-moonlight/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
