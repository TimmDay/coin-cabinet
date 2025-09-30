"use client";
import { CldImage } from "next-cloudinary";

type Props = {
  src?: string;
  width?: number;
  height?: number;
};

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function CloudinaryImage({
  src,
  width = 200,
  height = 200,
}: Props) {
  return (
    <CldImage
      src={src ?? "1_faustina_II_sestertius_o"}
      width={width} // Transform the image: auto-crop to square aspect_ratio
      height={height}
      crop={{
        type: "auto",
        source: true,
      }}
      alt=""
    />
  );
}
