"use client"

import { useState } from "react"
import CloudinaryImage from "~/components/CloudinaryImage"

type ImageCarouselProps = {
  /** Cloudinary public ids or URLs. One shows as a plain image. */
  images: string[]
  alt: string
}

/**
 * One image, or a row of them to step through: clicking the picture shows the
 * next (and wraps), and the dots below jump to one.
 */
export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)

  const current = images[Math.min(index, images.length - 1)]
  if (!current) return null

  const picture = (
    <CloudinaryImage src={current} alt={alt} width={400} height={400} />
  )

  if (images.length === 1) return picture

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % images.length)}
        className="focus-visible:ring-moonlight/70 cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`${alt}: image ${index + 1} of ${images.length}. Show the next image`}
      >
        {picture}
      </button>
      <div className="flex gap-2" role="group" aria-label="Choose an image">
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
    </div>
  )
}
