import Image from "next/image"

export function StaticMap({ lat, lng, zoom = 6, width = 600, height = 300 }) {
  // Example: Use a static map provider (e.g., Mapbox Static, Google Static Maps, or a placeholder)
  // Replace the URL below with your actual static map provider and API key if needed
  const src = `https://static-maps.yourprovider.com/?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}`
  return (
    <div className="flex w-full items-center justify-center">
      <Image
        src={src}
        alt="Map centered on birth event"
        width={width}
        height={height}
        className="rounded-lg border border-slate-300"
        unoptimized
      />
    </div>
  )
}
