"use client"
import { CldImage, getCldImageUrl } from "next-cloudinary"

type Props = {
  src?: string
  width?: number
  height?: number
  alt?: string
}

// Utility function to prefetch Cloudinary images
export function prefetchCloudinaryImage(
  src: string | undefined,
  width = 200,
  height = 200,
) {
  if (!src) return
  const img = new Image()
  // Use the same URL generation logic as CldImage to ensure cache hits.
  img.src = getCldImageUrl({
    src,
    width,
    height,
    crop: {
      type: "pad",
      source: true,
    },
    background: "transparent",
  })
}

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function CloudinaryImage({
  src,
  width = 200,
  height = 200,
  alt = "",
}: Props) {
  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded bg-slate-800/20"
        style={{ width, height }}
      >
        <div className="text-xs text-slate-500">No Image</div>
      </div>
    )
  }

  return (
    <CldImage
      src={src}
      width={width}
      height={height}
      crop={{
        type: "pad",
        source: true,
      }}
      background="transparent"
      alt={alt}
      sizes={`${width}px`}
      style={{ width, height }}
    />
  )
}
