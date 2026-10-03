"use client"
import { CldImage, getCldImageUrl } from "next-cloudinary"

type Props = {
  src?: string
  width?: number
  height?: number
  alt?: string
  onLoad?: () => void
  onError?: () => void
  priority?: boolean
  /** Crop the empty margin first so the subject fills the whole box. */
  trim?: boolean
  /** Keep the picture's own shape (scaled to fit the box) instead of padding it to a square. */
  fit?: boolean
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
  onLoad,
  onError,
  priority = false,
  trim = false,
  fit = false,
}: Props) {
  if (!src) {
    return (
      <div className="bg-surface-muted flex h-[200px] w-[200px] items-center justify-center rounded">
        <div className="text-moonlight/70 text-xs">No Image</div>
      </div>
    )
  }

  return (
    <CldImage
      src={src}
      width={width}
      height={height}
      crop={{
        type: fit ? "fit" : "pad",
        source: true,
      }}
      background="transparent"
      trim={trim}
      alt={alt}
      sizes={`${width}px`}
      className={
        fit
          ? "h-auto w-auto max-w-full"
          : "max-h-full max-w-full object-contain"
      }
      onLoad={onLoad}
      onError={onError}
      priority={priority}
    />
  )
}
