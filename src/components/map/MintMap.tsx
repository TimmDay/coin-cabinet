"use client"

import L, { DivIcon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useMemo, useState } from "react"
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet"
import type { TimePeriod } from "../../data/romanBoundaries"
import { ROMAN_TIME_PERIODS } from "../../data/romanBoundaries"
import {
  useEmpireLayerState,
  useMapConfiguration,
  useMapData,
  useProvinceSelection,
} from "./hooks"
import { createMapCardHTML } from "./MapCard"
import { MapEmbeddedControls } from "./MapEmbeddedControls"

// Component to handle zoom level changes
function ZoomHandler({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void
}) {
  useMapEvents({
    zoomend: (e) => {
      const zoom = (e.target as L.Map).getZoom()
      onZoomChange(zoom)
    },
  })
  return null
}

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
  /** Layout mode - 'default' shows controls above map, 'fullscreen' shows controls below map */
  layout?: "default" | "fullscreen"
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
  /** Selected provinces */
  selectedProvinces?: string[]
  /** Show province labels */
  showProvinceLabels?: boolean
  /** Hide all map controls (for external control) */
  hideControls?: boolean
}

export const MintMap: React.FC<MintMapProps> = ({
  center,
  zoom,
  height = "400px",
  width = "100%",
  className = "",
  layout = "default",
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
  selectedProvinces: externalSelectedProvinces,
  showProvinceLabels: externalShowProvinceLabels = true,
  hideControls = false,
}) => {
  // Use custom hooks for configuration and data management
  const config = useMapConfiguration()
  const {
    provincesData,
    provincesLabelsData,
    loading: provincesLoading,
    error,
  } = useMapData()

  // Local state for map-specific functionality
  const [currentPeriod, setCurrentPeriod] = useState<string | null>(
    selectedPeriod ?? null,
  )
  const [boundaries, setBoundaries] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [internalSelectedProvinces, setInternalSelectedProvinces] = useState<
    string[]
  >([])
  const [internalShowProvinceLabels, setInternalShowProvinceLabels] =
    useState(true)
  const [currentZoom, setCurrentZoom] = useState<number>(config.defaultZoom)

  // Province selection logic using custom hook
  const allProvinces = useMemo(() => {
    if (!provincesData) return []
    return provincesData.features
      .map((feature) => feature.properties?.name as string)
      .filter(Boolean)
  }, [provincesData])

  const { isExternallyControlled, defaultProvinces } = useProvinceSelection(
    allProvinces,
    externalSelectedProvinces,
  )

  // Use external props if provided, otherwise use internal state
  const selectedProvinces =
    externalSelectedProvinces ?? internalSelectedProvinces
  const showProvinceLabels =
    externalShowProvinceLabels ?? internalShowProvinceLabels
  const setSelectedProvinces = isExternallyControlled
    ? () => {
        /* controlled externally */
      }
    : setInternalSelectedProvinces
  const setShowProvinceLabels =
    externalShowProvinceLabels !== undefined
      ? () => {
          /* controlled externally */
        }
      : setInternalShowProvinceLabels

  // Use actual center and zoom from config if not provided
  const mapCenter = center ?? config.defaultCenter
  const mapZoom = zoom ?? config.defaultZoom

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

  // Use empire layer state management hook
  const {
    layerStates,
    isLayerVisible,
    toggleLayer,
    clearAllEmpireLayers,
    hasAnyEmpireLayerVisible,
  } = useEmpireLayerState(empireLayerConfig)

  // Helper function to get layer data (bridge between hook and old interface)
  const getLayerData = (layerKey: string) => {
    // For now, since the hook doesn't load data automatically,
    // we'll return null and let the existing logic handle it
    // This will be improved when we move layer data loading to the hook
    return null
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
    if (!provincesLabelsData) return []

    // If no provinces are selected, show all provinces by default
    const shouldShowAll = selectedProvinces.length === 0

    return provincesLabelsData.features
      .filter(
        (feature) =>
          shouldShowAll ||
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
          /* No background - transparent labels */
        }
        .province-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .province-popup .leaflet-popup-content {
          margin: 0 !important;
        }
      `}</style>
      <div
        className={
          layout === "fullscreen"
            ? `flex h-full flex-col gap-4 ${className}`
            : `space-y-4 ${className}`
        }
      >
        {/* Controls Container */}
        {!hideControls && (
          <MapEmbeddedControls
            layout={layout}
            timePeriods={timePeriods}
            currentPeriod={currentPeriod}
            onPeriodChange={(periodId: string) => {
              const newPeriod = periodId === currentPeriod ? null : periodId
              setCurrentPeriod(newPeriod)
              onPeriodChange?.(periodId)
            }}
            empireLayerConfig={empireLayerConfig}
            isLayerVisible={isLayerVisible}
            toggleLayer={toggleLayer}
            hasAnyEmpireLayerVisible={hasAnyEmpireLayerVisible}
            clearAllEmpireLayers={() => {
              setCurrentPeriod(null)
              clearAllEmpireLayers()
              onPeriodChange?.("")
            }}
            provinceOptions={provinceOptions}
            selectedProvinces={selectedProvinces}
            onProvinceSelectionChange={handleProvinceSelectionChange}
            provincesLoading={provincesLoading}
            showProvinceLabels={showProvinceLabels}
            onShowProvinceLabelsChange={setShowProvinceLabels}
          />
        )}

        {/* Map Container */}
        <div
          className={
            layout === "fullscreen"
              ? "order-1 flex-1"
              : `relative ${height === "400px" ? "h-96" : ""} ${width === "100%" ? "w-full" : ""}`
          }
        >
          <div
            className={
              layout === "fullscreen"
                ? "relative h-full w-full"
                : `relative ${height === "400px" ? "h-96" : ""} ${width === "100%" ? "w-full" : ""}`
            }
            {...(containerStyle && { style: containerStyle })}
          >
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              // Roman Empire bounds with 500km buffer (approximate)
              // Extended from Atlantic to Mesopotamia, from Scotland to Sahara
              maxBounds={[
                [65.0, -15.0], // Northeast: Scotland + buffer, Atlantic + buffer
                [20, 55.0], // Southwest: North Africa + 200km extra south, Iraq + buffer
              ]}
              maxBoundsViscosity={1.0}
              minZoom={config.minZoom}
              maxZoom={config.maxZoom}
            >
              <TileLayer
                // Using CartoDB Positron No Labels for muted styling without country names
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                // Custom styling to make it more muted
                opacity={0.7}
              />

              {/* Zoom Level Handler */}
              <ZoomHandler onZoomChange={setCurrentZoom} />

              {/* BC 60 Empire Extent Layer */}
              {isLayerVisible("bc60") && getLayerData("bc60") && (
                <GeoJSON
                  key="bc60-extent"
                  data={getLayerData("bc60")!}
                  style={empireLayerConfig.bc60.style}
                  onEachFeature={(feature, layer) => {
                    const popup = createMapCardHTML({
                      title: empireLayerConfig.bc60.title,
                      description: empireLayerConfig.bc60.description,
                    })
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
                    const popup = createMapCardHTML({
                      title: empireLayerConfig.ad14.title,
                      description: empireLayerConfig.ad14.description,
                    })
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
                    const popup = createMapCardHTML({
                      title: empireLayerConfig.ad69.title,
                      description: empireLayerConfig.ad69.description,
                    })
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
                    const popup = createMapCardHTML({
                      title: empireLayerConfig.ad117.title,
                      description: empireLayerConfig.ad117.description,
                    })
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
                    const popup = createMapCardHTML({
                      title: empireLayerConfig.ad200.title,
                      description: empireLayerConfig.ad200.description,
                    })
                    layer.bindPopup(popup, {
                      maxWidth: 300,
                      className: "ad200-popup",
                    })
                  }}
                />
              )}

              {/* Selected Provinces Layer */}
              {provincesData && (
                <GeoJSON
                  key={`provinces-${selectedProvinces.length === 0 ? "all" : selectedProvinces.join("-")}`}
                  data={(() => {
                    // If no provinces are selected, show all provinces by default
                    const shouldShowAll = selectedProvinces.length === 0
                    const filteredFeatures = provincesData.features.filter(
                      (feature) =>
                        shouldShowAll ||
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
                      const popup = createMapCardHTML({
                        title: name,
                        description: "Roman Province",
                        className: "text-emerald-800",
                      })
                      layer.bindPopup(popup, {
                        maxWidth: 300,
                        className: "province-popup",
                      })
                    }
                  }}
                />
              )}

              {/* Province Labels */}
              {showProvinceLabels &&
                currentZoom > 4 &&
                provinceLabels.map((label) => (
                  <Marker
                    key={`label-${label.name}`}
                    position={label.position}
                    interactive={false}
                    icon={
                      new DivIcon({
                        className: "province-label",
                        html: `<div style="
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #065f46;
                    text-align: center;
                    white-space: pre;
                    line-height: 1.2;
                    width: max-content;
                    pointer-events: none;
                    transform: translateX(-40%) translateY(-50%);
                  ">${label.name.replace(/\s/, "\n")}</div>`,
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
                      const details = []
                      if (props.capital)
                        details.push({ label: "Capital", value: props.capital })
                      if (props.governor)
                        details.push({
                          label: "Governor",
                          value: props.governor,
                        })
                      if (props.established) {
                        const year =
                          props.established > 0
                            ? `${props.established} CE`
                            : `${Math.abs(props.established)} BCE`
                        details.push({ label: "Established", value: year })
                      }

                      const popup = createMapCardHTML({
                        title:
                          props.latinName ?? props.name ?? "Unknown Province",
                        subtitle:
                          props.name &&
                          props.latinName &&
                          props.name !== props.latinName
                            ? `Modern: ${props.name}`
                            : undefined,
                        details,
                        notes: props.notes,
                      })
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
      </div>
    </>
  )
}
