"use client"

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import L from "leaflet"
import type { TimePeriod } from "../../data/romanBoundaries"
import { ROMAN_TIME_PERIODS } from "../../data/romanBoundaries"

type MintMapProps = {
  /** Center coordinates of the map [latitude, longitude] */
  center?: [number, number]
  /** Zoom level of the map */
  zoom?: number
  /** Height of the map container */
  height?: string
  /** Width of the map container */
  width?: string
  /** Additional CSS class names */
  className?: string
  /** Available time periods for boundary display */
  timePeriods?: TimePeriod[]
  /** Currently selected time period */
  selectedPeriod?: string
  /** Show province boundaries */
  showBoundaries?: boolean
  /** Callback when time period changes */
  onPeriodChange?: (periodId: string) => void
}

export const MintMap: React.FC<MintMapProps> = ({
  center = [41.0, 21.0], // Approximate center of Roman Empire (Balkans)
  zoom = 4,
  height = "400px",
  width = "100%",
  className = "",
  timePeriods = ROMAN_TIME_PERIODS,
  selectedPeriod,
  showBoundaries = true,
  onPeriodChange,
}) => {
  const [currentPeriod, setCurrentPeriod] = useState<string | null>(selectedPeriod ?? null)
  const [boundaries, setBoundaries] = useState<GeoJSON.FeatureCollection | null>(null)

  // Load boundaries for selected period
  useEffect(() => {
    if (currentPeriod && timePeriods.length > 0) {
      const period = timePeriods.find(p => p.id === currentPeriod)
      if (period) {
        setBoundaries(period.boundaries)
      }
    } else {
      setBoundaries(null)
    }
  }, [currentPeriod, timePeriods])

  // Update internal state when selectedPeriod prop changes
  useEffect(() => {
    setCurrentPeriod(selectedPeriod ?? null)
  }, [selectedPeriod])

  useEffect(() => {
    // Fix for Leaflet default markers not showing properly in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })
  }, [])

  // Handle period change
  const handlePeriodChange = (periodId: string) => {
    setCurrentPeriod(periodId === currentPeriod ? null : periodId)
    onPeriodChange?.(periodId)
  }

  // Styling for province boundaries
  const boundaryStyle = {
    color: '#8B4513', // Roman brown
    weight: 2,
    opacity: 0.8,
    fillColor: '#DEB887',
    fillOpacity: 0.1,
  }



  // Apply custom dimensions if provided, otherwise use Tailwind defaults
  const containerStyle = 
    height !== "400px" || width !== "100%" 
      ? { height: height === "400px" ? "400px" : height, width: width === "100%" ? "100%" : width }
      : undefined

  return (
    <>
      {/* Custom CSS for province labels */}
      <style jsx global>{`
        .province-label {
          background: rgba(139, 69, 19, 0.85) !important;
          color: white !important;
          border: 1px solid #8B4513 !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }
        .province-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .province-popup .leaflet-popup-content {
          margin: 0 !important;
        }
      `}</style>
      <div className={`space-y-4 ${className}`}>
        {/* Time Period Controls */}
      {timePeriods.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Historical Periods</h3>
            {currentPeriod && (
              <button
                onClick={() => {
                  setCurrentPeriod(null)
                  onPeriodChange?.("")
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear boundaries
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {timePeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => handlePeriodChange(period.id)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                  currentPeriod === period.id
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
                title={period.description}
              >
                {period.name}
              </button>
            ))}
          </div>
          {currentPeriod && (
            <div className="text-xs text-gray-600">
              {timePeriods.find(p => p.id === currentPeriod)?.description}
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div 
        className={`relative ${height === "400px" ? "h-96" : ""} ${width === "100%" ? "w-full" : ""}`}
        {...(containerStyle && { style: containerStyle })}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full"
          // Roman Empire bounds with 500km buffer (approximate)
          // Extended from Atlantic to Mesopotamia, from Scotland to Sahara
          maxBounds={[
            [65.0, -15.0], // Northeast: Scotland + buffer, Atlantic + buffer
            [25.0, 55.0],  // Southwest: North Africa + buffer, Iraq + buffer
          ]}
          maxBoundsViscosity={1.0}
          minZoom={3}
          maxZoom={15}
        >
          <TileLayer
            // Using CartoDB Positron No Labels for muted styling without country names
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            // Custom styling to make it more muted
            opacity={0.7}
          />
          
          {/* Historical Boundaries Layer */}
          {showBoundaries && boundaries && (
            <GeoJSON
              key={currentPeriod} // Force re-render when period changes
              data={boundaries}
              style={boundaryStyle}
              onEachFeature={(feature, layer) => {
                // Add province name popup and tooltip with details
                if (feature.properties && 'name' in feature.properties) {
                  const props = feature.properties as {
                    name?: string
                    latinName?: string
                    capital?: string
                    governor?: string
                    established?: number
                    notes?: string
                  }
                  
                  // Bind tooltip with Latin name (always visible)
                  const latinName = props.latinName ?? props.name ?? 'Unknown Province'
                  layer.bindTooltip(latinName, {
                    permanent: true,
                    direction: 'center',
                    className: 'province-label',
                    opacity: 0.9
                  })

                  // Bind detailed popup on click
                  const popup = `
                    <div class="p-3 min-w-0">
                      <h4 class="font-bold text-amber-800 text-base mb-2">
                        ${props.latinName ?? props.name ?? 'Unknown Province'}
                      </h4>
                      ${props.name && props.latinName && props.name !== props.latinName ? 
                        `<p class="text-sm text-gray-600 mb-2"><em>Modern: ${props.name}</em></p>` : ''}
                      ${props.capital ? `<p class="mb-1"><strong>Capital:</strong> ${props.capital}</p>` : ''}
                      ${props.governor ? `<p class="mb-1"><strong>Governor:</strong> ${props.governor}</p>` : ''}
                      ${props.established ? `<p class="mb-1"><strong>Established:</strong> ${props.established > 0 ? props.established + ' CE' : Math.abs(props.established) + ' BCE'}</p>` : ''}
                      ${props.notes ? `<p class="text-sm text-gray-600 mt-2 leading-relaxed">${props.notes}</p>` : ''}
                    </div>
                  `
                  layer.bindPopup(popup, {
                    maxWidth: 300,
                    className: 'province-popup'
                  })
                }
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
    </>
  )
}