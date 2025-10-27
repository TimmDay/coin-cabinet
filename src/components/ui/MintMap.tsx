"use client"

import L, { DivIcon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useMemo, useState } from "react"
import { GeoJSON, MapContainer, Marker, TileLayer } from "react-leaflet"
import type { TimePeriod } from "../../data/romanBoundaries"
import { ROMAN_TIME_PERIODS } from "../../data/romanBoundaries"
import { SimpleMultiSelect } from "./SimpleMultiSelect"

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
  /** Show BC 60 empire extent layer */
  showBC60?: boolean
  /** Show AD 14 empire extent layer */
  showAD14?: boolean
  /** Show AD 69 empire extent layer */
  showAD69?: boolean
  /** Show AD 117 empire extent layer */
  showAD117?: boolean
  /** Show AD 200 empire extent layer */
  showAD200?: boolean
  /** Callback when time period changes */
  onPeriodChange?: (periodId: string) => void
  /** Callback when BC60 layer toggle changes */
  onBC60Change?: (show: boolean) => void
  /** Callback when AD14 layer toggle changes */
  onAD14Change?: (show: boolean) => void
  /** Callback when AD69 layer toggle changes */
  onAD69Change?: (show: boolean) => void
  /** Callback when AD117 layer toggle changes */
  onAD117Change?: (show: boolean) => void
  /** Callback when AD200 layer toggle changes */
  onAD200Change?: (show: boolean) => void
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
  showBC60 = false,
  showAD14 = false,
  showAD69 = false,
  showAD117 = false,
  showAD200 = false,
  onPeriodChange,
  onBC60Change,
  onAD14Change,
  onAD69Change,
  onAD117Change,
  onAD200Change,
}) => {
  const [currentPeriod, setCurrentPeriod] = useState<string | null>(
    selectedPeriod ?? null,
  )
  const [boundaries, setBoundaries] =
    useState<GeoJSON.FeatureCollection | null>(null)

  // Provinces data and selection state
  const [provincesData, setProvincesData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [provincesLabelsData, setProvincesLabelsData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [provincesLoading, setProvincesLoading] = useState(false)
  const [showProvinceLabels, setShowProvinceLabels] = useState(true)

  // Empire extent layer configuration
  const empireLayerConfig = useMemo(
    () =>
      ({
        bc60: {
          id: "bc60",
          name: "BC 60",
          title: "Roman Republic BC 60",
          filename: "roman_empire_bc_60_extent.geojson",
          description:
            "Roman Republic around 60 BCE, during the First Triumvirate (Caesar, Pompey, Crassus)",
          showProp: showBC60,
          onChange: onBC60Change,
          color: "#8B4513",
          fillColor: "#DEB887",
          style: {
            color: "#8B4513",
            weight: 2,
            opacity: 0.8,
            fillColor: "#DEB887",
            fillOpacity: 0.15,
            dashArray: "6, 3",
          },
        },
        ad14: {
          id: "ad14",
          name: "AD 14",
          title: "Roman Empire AD 14",
          filename: "roman_empire_ad_14_extent.geojson",
          description: "Roman Empire at the death of Augustus in AD 14",
          showProp: showAD14,
          onChange: onAD14Change,
          color: "#4169E1",
          fillColor: "#87CEEB",
          style: {
            color: "#4169E1",
            weight: 2,
            opacity: 0.8,
            fillColor: "#87CEEB",
            fillOpacity: 0.15,
            dashArray: "5, 4",
          },
        },
        ad69: {
          id: "ad69",
          name: "AD 69",
          title: "Roman Empire AD 69",
          filename: "roman_empire_ad_69_extent.geojson",
          description:
            "Roman Empire in AD 69, the Year of the Four Emperors (Galba, Otho, Vitellius, Vespasian)",
          showProp: showAD69,
          onChange: onAD69Change,
          color: "#DC143C",
          fillColor: "#FFB6C1",
          style: {
            color: "#DC143C",
            weight: 2,
            opacity: 0.8,
            fillColor: "#FFB6C1",
            fillOpacity: 0.15,
            dashArray: "4, 5",
          },
        },
        ad117: {
          id: "ad117",
          name: "AD 117",
          title: "Roman Empire AD 117",
          filename: "roman_empire_ad_117_extent.geojson",
          description:
            "Roman Empire at its greatest extent under Trajan in AD 117",
          showProp: showAD117,
          onChange: onAD117Change,
          color: "#228B22",
          fillColor: "#90EE90",
          style: {
            color: "#228B22",
            weight: 2,
            opacity: 0.8,
            fillColor: "#90EE90",
            fillOpacity: 0.15,
            dashArray: "3, 6",
          },
        },
        ad200: {
          id: "ad200",
          name: "AD 200",
          title: "Roman Empire AD 200",
          filename: "roman_empire_AD_200_extent.geojson",
          description: "Roman Empire around AD 200, during the Severan dynasty",
          showProp: showAD200,
          onChange: onAD200Change,
          color: "#FF8C00",
          fillColor: "#FFE4B5",
          style: {
            color: "#FF8C00",
            weight: 2,
            opacity: 0.8,
            fillColor: "#FFE4B5",
            fillOpacity: 0.15,
            dashArray: "2, 7",
          },
        },
      }) as const,
    [
      showBC60,
      onBC60Change,
      showAD14,
      onAD14Change,
      showAD69,
      onAD69Change,
      showAD117,
      onAD117Change,
      showAD200,
      onAD200Change,
    ],
  )

  // Consolidated layer states using configuration
  const [layerStates, setLayerStates] = useState(() => {
    const initialStates: Record<
      string,
      {
        visible: boolean
        data: GeoJSON.FeatureCollection | null
      }
    > = {}

    Object.entries(empireLayerConfig).forEach(([key, config]) => {
      initialStates[key] = {
        visible: config.showProp,
        data: null,
      }
    })

    return initialStates
  })

  // Helper function to load empire layer data
  const loadLayerData = async (layerKey: string, filename: string) => {
    try {
      const response = await fetch(`/data/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`)
      }
      const data = (await response.json()) as GeoJSON.FeatureCollection

      setLayerStates((prev) => ({
        ...prev,
        [layerKey]: {
          visible: prev[layerKey]?.visible ?? false,
          data,
        },
      }))
    } catch (error) {
      console.error(`Error loading Roman Empire ${layerKey} data:`, error)
      setLayerStates((prev) => ({
        ...prev,
        [layerKey]: {
          visible: prev[layerKey]?.visible ?? false,
          data: {
            type: "FeatureCollection",
            features: [],
          },
        },
      }))
    }
  }

  // Helper function to toggle layer visibility
  const toggleLayer = (layerKey: string) => {
    const config = empireLayerConfig[layerKey as keyof typeof empireLayerConfig]
    const newValue = !layerStates[layerKey]?.visible

    setLayerStates((prev) => ({
      ...prev,
      [layerKey]: {
        data: prev[layerKey]?.data ?? null,
        visible: newValue,
      },
    }))

    config.onChange?.(newValue)
  }

  // Generate province options from loaded data
  const provinceOptions = useMemo(() => {
    if (!provincesData) return []

    return provincesData.features
      .map((feature) => {
        const name = feature.properties?.name as string
        return name ? { value: name, label: name } : null
      })
      .filter(
        (option): option is { value: string; label: string } => option !== null,
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [provincesData])

  // Handle province selection change
  const handleProvinceSelectionChange = (newSelection: string[]) => {
    setSelectedProvinces(newSelection)
  }

  // Get province labels from labels data
  const provinceLabels = useMemo(() => {
    if (!provincesLabelsData || selectedProvinces.length === 0) return []

    return provincesLabelsData.features
      .filter((feature) =>
        selectedProvinces.includes(feature.properties?.name as string),
      )
      .map((feature) => {
        const name = feature.properties?.name as string
        if (!name || feature.geometry.type !== "Point") return null

        const coordinates = feature.geometry.coordinates as [number, number]
        // Convert from [lng, lat] to [lat, lng] for Leaflet
        const position: [number, number] = [coordinates[1], coordinates[0]]

        return { name, position }
      })
      .filter(
        (label): label is { name: string; position: [number, number] } =>
          label !== null,
      )
  }, [provincesLabelsData, selectedProvinces])

  // Load boundaries for selected period
  useEffect(() => {
    if (currentPeriod && timePeriods.length > 0) {
      const period = timePeriods.find((p) => p.id === currentPeriod)
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

  // Consolidated effect to sync layer visibility from props
  useEffect(() => {
    setLayerStates((prev) => {
      const newStates = { ...prev }
      let hasChanges = false

      Object.entries(empireLayerConfig).forEach(([key, config]) => {
        if (prev[key]?.visible !== config.showProp) {
          newStates[key] = {
            data: prev[key]?.data ?? null,
            visible: config.showProp,
          }
          hasChanges = true
        }
      })

      return hasChanges ? newStates : prev
    })
  }, [showBC60, showAD14, showAD69, showAD117, showAD200, empireLayerConfig])

  // Consolidated effect to load layer data when needed
  useEffect(() => {
    Object.entries(empireLayerConfig).forEach(([key, config]) => {
      const layerState = layerStates[key]
      if (layerState?.visible && !layerState.data) {
        void loadLayerData(key, config.filename)
      }
    })
  }, [layerStates, empireLayerConfig])

  // Load provinces data on component mount
  useEffect(() => {
    const loadProvincesData = async () => {
      if (provincesData && provincesLabelsData) return // Already loaded

      setProvincesLoading(true)
      try {
        // Load both provinces and province labels data
        const [provincesResponse, labelsResponse] = await Promise.all([
          fetch("/data/provinces.geojson"),
          fetch("/data/provinces_label.geojson"),
        ])

        if (!provincesResponse.ok) {
          throw new Error(
            `Failed to load provinces data: ${provincesResponse.statusText}`,
          )
        }
        if (!labelsResponse.ok) {
          throw new Error(
            `Failed to load province labels data: ${labelsResponse.statusText}`,
          )
        }

        const [provincesData, labelsData] = await Promise.all([
          provincesResponse.json() as Promise<GeoJSON.FeatureCollection>,
          labelsResponse.json() as Promise<GeoJSON.FeatureCollection>,
        ])

        setProvincesData(provincesData)
        setProvincesLabelsData(labelsData)
      } catch (error) {
        console.error("Failed to load provinces data:", error)
      } finally {
        setProvincesLoading(false)
      }
    }

    void loadProvincesData()
  }, [provincesData, provincesLabelsData])

  useEffect(() => {
    // Fix for Leaflet default markers not showing properly in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })
  }, [])

  // Handle period change
  const handlePeriodChange = (periodId: string) => {
    setCurrentPeriod(periodId === currentPeriod ? null : periodId)
    onPeriodChange?.(periodId)
  }

  // Clear all empire layers
  const clearAllEmpireLayers = () => {
    Object.keys(empireLayerConfig).forEach((key) => {
      const config = empireLayerConfig[key as keyof typeof empireLayerConfig]
      setLayerStates((prev) => ({
        ...prev,
        [key]: {
          data: prev[key]?.data ?? null,
          visible: false,
        },
      }))
      config.onChange?.(false)
    })
  }

  // Helper functions to get current layer states
  const isLayerVisible = (layerKey: string) =>
    layerStates[layerKey]?.visible ?? false
  const getLayerData = (layerKey: string) => layerStates[layerKey]?.data ?? null
  const hasAnyEmpireLayerVisible = () =>
    Object.keys(empireLayerConfig).some((key) => isLayerVisible(key))

  // Styling for province boundaries
  const boundaryStyle = {
    color: "#8B4513", // Roman brown
    weight: 2,
    opacity: 0.8,
    fillColor: "#DEB887",
    fillOpacity: 0.1,
  }

  // Styling for AD 200 empire extent layer

  // Apply custom dimensions if provided, otherwise use Tailwind defaults
  const containerStyle =
    height !== "400px" || width !== "100%"
      ? {
          height: height === "400px" ? "400px" : height,
          width: width === "100%" ? "100%" : width,
        }
      : undefined

  return (
    <>
      {/* Custom CSS for province labels */}
      <style jsx global>{`
        .province-label {
          background: rgba(139, 69, 19, 0.85) !important;
          color: white !important;
          border: 1px solid #8b4513 !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
        }
        .province-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
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
              <h3 className="text-sm font-medium text-gray-700">
                Historical Periods
              </h3>
              {(currentPeriod ?? hasAnyEmpireLayerVisible()) && (
                <button
                  onClick={() => {
                    setCurrentPeriod(null)
                    clearAllEmpireLayers()
                    onPeriodChange?.("")
                  }}
                  className="text-xs text-gray-500 underline hover:text-gray-700"
                >
                  Clear all layers
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {timePeriods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => handlePeriodChange(period.id)}
                  className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                    currentPeriod === period.id
                      ? "border-amber-700 bg-amber-700 text-white"
                      : "border-amber-200 bg-white text-amber-800 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                  title={period.description}
                >
                  {period.name}
                </button>
              ))}
            </div>
            {currentPeriod && (
              <div className="text-xs text-gray-600">
                {timePeriods.find((p) => p.id === currentPeriod)?.description}
              </div>
            )}
          </div>
        )}

        {/* Empire Extent Layers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Empire Extent</h3>
            {hasAnyEmpireLayerVisible() && (
              <button
                onClick={clearAllEmpireLayers}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Clear all empire layers
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(empireLayerConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                  isLayerVisible(key)
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-amber-200 bg-white text-amber-800 hover:border-amber-300 hover:bg-amber-50"
                }`}
                title={config.description}
              >
                {config.name}
              </button>
            ))}
          </div>
          {hasAnyEmpireLayerVisible() && (
            <div className="space-y-1 text-xs text-gray-600">
              {Object.entries(empireLayerConfig).map(
                ([key, config]) =>
                  isLayerVisible(key) && (
                    <div key={key} className="truncate">
                      <strong>{config.name}:</strong> {config.description}
                    </div>
                  ),
              )}
            </div>
          )}
        </div>

        {/* Roman Provinces */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Roman Provinces</h3>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <SimpleMultiSelect
                options={provinceOptions}
                selectedValues={selectedProvinces}
                onSelectionChange={handleProvinceSelectionChange}
                placeholder={
                  provincesLoading
                    ? "Loading provinces..."
                    : "Select provinces to highlight..."
                }
                className="rounded-md border border-gray-300 bg-white text-gray-900"
                maxHeight="max-h-48"
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() =>
                  setSelectedProvinces(
                    provinceOptions.map((option) => option.value),
                  )
                }
                disabled={provincesLoading || provinceOptions.length === 0}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Select all provinces"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedProvinces([])}
                disabled={selectedProvinces.length === 0}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Clear all selected provinces"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowProvinceLabels(!showProvinceLabels)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  showProvinceLabels
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title={showProvinceLabels ? "Hide province labels" : "Show province labels"}
              >
                {showProvinceLabels ? 'Hide Labels' : 'Show Labels'}
              </button>
            </div>
          </div>
          {selectedProvinces.length > 0 && (
            <div className="text-xs text-gray-600">
              Showing {selectedProvinces.length} province
              {selectedProvinces.length !== 1 ? "s" : ""} highlighted on the map
            </div>
          )}
        </div>

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
              [20, 55.0], // Southwest: North Africa + 200km extra south, Iraq + buffer
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

            {/* BC 60 Empire Extent Layer */}
            {isLayerVisible("bc60") && getLayerData("bc60") && (
              <GeoJSON
                key="bc60-extent"
                data={getLayerData("bc60")!}
                style={empireLayerConfig.bc60.style}
                onEachFeature={(feature, layer) => {
                  const popup = `
                  <div class="p-3 min-w-0">
                    <h4 class="font-bold text-amber-800 text-base mb-2">
                      ${empireLayerConfig.bc60.title}
                    </h4>
                    <p class="text-sm text-gray-600">
                      ${empireLayerConfig.bc60.description}
                    </p>
                  </div>
                `
                  layer.bindPopup(popup, {
                    maxWidth: 300,
                    className: "bc60-popup",
                  })
                }}
              />
            )}

            {/* AD 14 Empire Extent Layer */}
            {isLayerVisible("ad14") && getLayerData("ad14") && (
              <GeoJSON
                key="ad14-extent"
                data={getLayerData("ad14")!}
                style={empireLayerConfig.ad14.style}
                onEachFeature={(feature, layer) => {
                  const popup = `
                  <div class="p-3 min-w-0">
                    <h4 class="font-bold text-amber-800 text-base mb-2">
                      ${empireLayerConfig.ad14.title}
                    </h4>
                    <p class="text-sm text-gray-600">
                      ${empireLayerConfig.ad14.description}
                    </p>
                  </div>
                `
                  layer.bindPopup(popup, {
                    maxWidth: 300,
                    className: "ad14-popup",
                  })
                }}
              />
            )}

            {/* AD 69 Empire Extent Layer */}
            {isLayerVisible("ad69") && getLayerData("ad69") && (
              <GeoJSON
                key="ad69-extent"
                data={getLayerData("ad69")!}
                style={empireLayerConfig.ad69.style}
                onEachFeature={(feature, layer) => {
                  const popup = `
                  <div class="p-3 min-w-0">
                    <h4 class="font-bold text-amber-800 text-base mb-2">
                      ${empireLayerConfig.ad69.title}
                    </h4>
                    <p class="text-sm text-gray-600">
                      ${empireLayerConfig.ad69.description}
                    </p>
                  </div>
                `
                  layer.bindPopup(popup, {
                    maxWidth: 300,
                    className: "ad69-popup",
                  })
                }}
              />
            )}

            {/* AD 117 Empire Extent Layer */}
            {isLayerVisible("ad117") && getLayerData("ad117") && (
              <GeoJSON
                key="ad117-extent"
                data={getLayerData("ad117")!}
                style={empireLayerConfig.ad117.style}
                onEachFeature={(feature, layer) => {
                  const popup = `
                  <div class="p-3 min-w-0">
                    <h4 class="font-bold text-amber-800 text-base mb-2">
                      ${empireLayerConfig.ad117.title}
                    </h4>
                    <p class="text-sm text-gray-600">
                      ${empireLayerConfig.ad117.description}
                    </p>
                  </div>
                `
                  layer.bindPopup(popup, {
                    maxWidth: 300,
                    className: "ad117-popup",
                  })
                }}
              />
            )}

            {/* AD 200 Empire Extent Layer */}
            {isLayerVisible("ad200") && getLayerData("ad200") && (
              <GeoJSON
                key="ad200-extent"
                data={getLayerData("ad200")!}
                style={empireLayerConfig.ad200.style}
                onEachFeature={(feature, layer) => {
                  const popup = `
                  <div class="p-3 min-w-0">
                    <h4 class="font-bold text-amber-800 text-base mb-2">
                      ${empireLayerConfig.ad200.title}
                    </h4>
                    <p class="text-sm text-gray-600">
                      ${empireLayerConfig.ad200.description}
                    </p>
                  </div>
                `
                  layer.bindPopup(popup, {
                    maxWidth: 300,
                    className: "ad200-popup",
                  })
                }}
              />
            )}

            {/* Selected Provinces Layer */}
            {selectedProvinces.length > 0 && provincesData && (
              <GeoJSON
                key={`provinces-${selectedProvinces.join("-")}`}
                data={(() => {
                  const filteredFeatures = provincesData.features.filter(
                    (feature) =>
                      selectedProvinces.includes(
                        feature.properties?.name as string,
                      ),
                  )
                  return {
                    type: "FeatureCollection",
                    features: filteredFeatures,
                  } as GeoJSON.FeatureCollection
                })()}
                style={{
                  color: "#059669", // Emerald border
                  weight: 2,
                  opacity: 0.8,
                  fillColor: "#10b981", // Emerald fill
                  fillOpacity: 0.2,
                  dashArray: "5, 5",
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.properties && "name" in feature.properties) {
                    const props = feature.properties as { name: string }
                    const name = props.name
                    const popup = `
                    <div class="p-3 min-w-0">
                      <h4 class="font-bold text-emerald-800 text-base mb-2">
                        ${name}
                      </h4>
                      <p class="text-sm text-gray-600">
                        Roman Province
                      </p>
                    </div>
                  `
                    layer.bindPopup(popup, {
                      maxWidth: 300,
                      className: "province-popup",
                    })
                  }
                }}
              />
            )}

            {/* Province Labels */}
            {showProvinceLabels && provinceLabels.map((label) => (
              <Marker
                key={`label-${label.name}`}
                position={label.position}
                icon={
                  new DivIcon({
                    className: "province-label",
                    html: `<div style="
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #10b981;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #065f46;
                    text-align: center;
                    white-space: nowrap;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  ">${label.name}</div>`,
                    iconSize: undefined,
                    iconAnchor: undefined,
                  })
                }
              />
            ))}

            {/* Historical Boundaries Layer */}
            {showBoundaries && boundaries && (
              <GeoJSON
                key={currentPeriod} // Force re-render when period changes
                data={boundaries}
                style={boundaryStyle}
                onEachFeature={(feature, layer) => {
                  // Add province name popup and tooltip with details
                  if (feature.properties && "name" in feature.properties) {
                    const props = feature.properties as {
                      name?: string
                      latinName?: string
                      capital?: string
                      governor?: string
                      established?: number
                      notes?: string
                    }

                    // Bind tooltip with Latin name (always visible)
                    const latinName =
                      props.latinName ?? props.name ?? "Unknown Province"
                    layer.bindTooltip(latinName, {
                      permanent: true,
                      direction: "center",
                      className: "province-label",
                      opacity: 0.9,
                    })

                    // Bind detailed popup on click
                    const popup = `
                    <div class="p-3 min-w-0">
                      <h4 class="font-bold text-amber-800 text-base mb-2">
                        ${props.latinName ?? props.name ?? "Unknown Province"}
                      </h4>
                      ${
                        props.name &&
                        props.latinName &&
                        props.name !== props.latinName
                          ? `<p class="text-sm text-gray-600 mb-2"><em>Modern: ${props.name}</em></p>`
                          : ""
                      }
                      ${props.capital ? `<p class="mb-1"><strong>Capital:</strong> ${props.capital}</p>` : ""}
                      ${props.governor ? `<p class="mb-1"><strong>Governor:</strong> ${props.governor}</p>` : ""}
                      ${props.established ? `<p class="mb-1"><strong>Established:</strong> ${props.established > 0 ? props.established + " CE" : Math.abs(props.established) + " BCE"}</p>` : ""}
                      ${props.notes ? `<p class="text-sm text-gray-600 mt-2 leading-relaxed">${props.notes}</p>` : ""}
                    </div>
                  `
                    layer.bindPopup(popup, {
                      maxWidth: 300,
                      className: "province-popup",
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
