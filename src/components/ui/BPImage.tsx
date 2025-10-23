"use client"

import { CldImage } from "next-cloudinary"

type BPImageProps = {
  /** The Cloudinary image source identifier */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Caption text to display below the image */
  caption: string
  /** Layout variant for the image */
  layout?: "center" | "left" | "right"
  /** Maximum height constraint in pixels, defaults to 400px */
  maxHeight?: number
  /** Additional CSS classes */
  className?: string
}

export function BPImage({
  src,
  alt,
  caption,
  layout = "center",
  maxHeight = 400,
  className = "",
}: BPImageProps) {
  const baseImageClasses = "rounded-lg shadow-lg"
  const baseCaptionClasses =
    "mt-3 text-sm text-slate-400 italic leading-relaxed"

  // Function to calculate optimal image dimensions based on layout
  const getOptimalDimensions = (layoutType: string) => {
    if (layoutType === "center") {
      // Center layout: larger images for full-width display
      // Use a reasonable max width but respect maxHeight
      return {
        width: 800,
        height: Math.min(600, maxHeight),
      }
    } else {
      // Left/right layouts: Use square dimensions to work well with any aspect ratio
      // This prevents chopping and ensures optimal space usage
      const squareSize = Math.min(400, maxHeight)
      return {
        width: squareSize,
        height: squareSize,
      }
    }
  }

  // Always render center layout first (it handles mobile conversion via CSS)
  if (layout === "center") {
    const { width, height } = getOptimalDimensions("center")
    return (
      <figure className={`my-8 flex flex-col items-center ${className}`}>
        <div className={`flex w-full justify-center`}>
          <div
            className={`${baseImageClasses} overflow-hidden`}
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <CldImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              crop={{
                type: "fit",
                source: true,
              }}
              className="block h-full w-full object-contain"
            />
          </div>
        </div>
        <figcaption className={`text-center ${baseCaptionClasses}`}>
          {caption}
        </figcaption>
      </figure>
    )
  }

  if (layout === "left") {
    const { width, height } = getOptimalDimensions("left")
    return (
      <figure
        className={`my-8 flex flex-col items-center lg:float-left lg:mr-6 lg:mb-4 lg:w-1/2 ${className}`}
      >
        <div className={`inline-block w-full text-center`}>
          <div className={`inline-block ${baseImageClasses} overflow-hidden`}>
            <CldImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              crop={{
                type: "fit",
                source: true,
              }}
              className="block h-full w-full object-contain"
            />
          </div>
        </div>
        <figcaption
          className={`text-center lg:text-left ${baseCaptionClasses}`}
        >
          {caption}
        </figcaption>
      </figure>
    )
  }

  if (layout === "right") {
    const { width, height } = getOptimalDimensions("right")
    return (
      <figure
        className={`my-8 flex flex-col items-center lg:float-right lg:mb-4 lg:ml-6 lg:w-1/2 ${className}`}
      >
        <div className={`inline-block w-full text-center`}>
          <div className={`inline-block ${baseImageClasses} overflow-hidden`}>
            <CldImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              crop={{
                type: "fit",
                source: true,
              }}
              className="block h-full w-full object-contain"
            />
          </div>
        </div>
        <figcaption
          className={`text-center lg:text-right ${baseCaptionClasses}`}
        >
          {caption}
        </figcaption>
      </figure>
    )
  }

  return null
}
