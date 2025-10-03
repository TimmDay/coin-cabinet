"use client";
import { CldImage, getCldImageUrl } from "next-cloudinary";

type Props = {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
};

// Utility function to prefetch Cloudinary images
export function prefetchCloudinaryImage(
  src: string | undefined,
  width = 200,
  height = 200,
) {
  if (!src) return;
  const img = new Image();
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
  });
}

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function CloudinaryImage({
  src,
  width = 200,
  height = 200,
  alt = "",
}: Props) {
  // TODO: loading shimmer?
  if (!src) {
    return null;
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
    />
  );
}
