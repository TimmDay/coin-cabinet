"use client";
import { CldImage } from "next-cloudinary";

type Props = {
  src?: string;
};

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
export default function CloudinaryImage({ src }: Props) {
  return (
    <CldImage
      src={src ?? "1_faustina_II_sestertius_o"}
      width="200" // Transform the image: auto-crop to square aspect_ratio
      height="200"
      crop={{
        type: "auto",
        source: true,
      }}
      alt=""
    />
  );
}
