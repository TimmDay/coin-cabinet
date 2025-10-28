"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { MapControls } from "~/components/map/MapControls"
import { NotFound404 } from "~/components/ui/NotFound404"
import { ROMAN_PROVINCES } from "~/constants/provinces"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("~/components/map/Map").then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
    ),
  },
)

export default function MapPage() {
  const isMapEnabled = useTypedFeatureFlag("map-feature")

  // Map state
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")
  const [showBC60, setShowBC60] = useState(false)
  const [showAD14, setShowAD14] = useState(false)
  const [showAD69, setShowAD69] = useState(false)
  const [showAD117, setShowAD117] = useState(false)
  const [showAD200, setShowAD200] = useState(false)
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([
    ...ROMAN_PROVINCES,
  ])
  const [showProvinceLabels, setShowProvinceLabels] = useState(true)

  // Show 404-like message if feature flag is not enabled
  if (!isMapEnabled) {
    return <NotFound404 />
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Interactive Map
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Explore the Roman Empire with our interactive historical map
        </p>
      </div>

      {/* Full-size Map Container */}
      <div className="h-[calc(100vh-140px)] flex-shrink-0">
        <div className="h-full p-4 sm:p-6 lg:p-8">
          <div className="h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
            <Map
              layout="fullscreen"
              height="100%"
              hideControls={true}
              selectedPeriod={selectedPeriod}
              showBC60={showBC60}
              showAD14={showAD14}
              showAD69={showAD69}
              showAD117={showAD117}
              showAD200={showAD200}
              selectedProvinces={selectedProvinces}
              showProvinceLabels={showProvinceLabels}
            />
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 lg:px-8">
        <MapControls
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          showBC60={showBC60}
          onBC60Change={setShowBC60}
          showAD14={showAD14}
          onAD14Change={setShowAD14}
          showAD69={showAD69}
          onAD69Change={setShowAD69}
          showAD117={showAD117}
          onAD117Change={setShowAD117}
          showAD200={showAD200}
          onAD200Change={setShowAD200}
          selectedProvinces={selectedProvinces}
          onProvincesChange={setSelectedProvinces}
          showProvinceLabels={showProvinceLabels}
          onProvinceLabelsChange={setShowProvinceLabels}
        />
      </div>
    </div>
  )
}
