"use client"

import L, { DivIcon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet"
import { ROMAN_MINTS } from "../../data/mints"
import { ROMAN_PROVINCES } from "./constants/provinces"
import {
  useEmpireLayerState,
  useMapConfiguration,
  useMapData,
  useProvinceSelection,
} from "./hooks"
import { createMapCardHTML } from "./MapCard"
import {
  createEmpireLayerConfig,
  LEAFLET_ICON_CONFIG,
  MAP_BOUNDS,
  MAP_STYLES,
  PROVINCE_LABEL_STYLES,
  TILE_LAYER_CONFIG,
  type EmpireLayerConfigMap,
} from "./mapConfig"
import { MapEmbeddedControls } from "./MapEmbeddedControls"
import { MapPopup } from "./MapPopup"
import { createHighlightedMintHtml } from "./MintMarkerSvg"

// Helper function to safely get map container from Leaflet event
function getMapContainer(event: L.LeafletMouseEvent): HTMLElement | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unnecessary-type-assertion
  return (event.target as any)?._map?._container ?? null
}

// Component to handle zoom level changes and pan events
function ZoomHandler({
  onZoomChange,
  onZoomStart,
  onPanStart,
}: {
  onZoomChange: (zoom: number) => void
  onZoomStart?: () => void
  onPanStart?: () => void
}) {
  useMapEvents({
    zoomstart: () => {
      onZoomStart?.()
    },
    zoomend: (e) => {
      const zoom = (e.target as L.Map).getZoom()
      onZoomChange(zoom)
    },
    movestart: () => {
      // Close popups when user starts panning/dragging the map
      onPanStart?.()
    },
  })
  return null
}

// Component to handle external center/zoom changes
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number]
  zoom: number
}) {
  const map = useMapEvents({})
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (map && center && zoom) {
      // Skip the first render to avoid interfering with initial map setup
      if (!hasMountedRef.current) {
        hasMountedRef.current = true
        return
      }

      // Use flyTo for smooth aerial-style animation to new position and zoom
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5, // 1.5 second animation for smoother effect
      })
    }
  }, [map, center, zoom])

  return null
}

type MapProps = {
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
  /** Mint name to highlight with special pin (case insensitive match) */
  highlightMint?: string
  /** Timeline event marker to show on the map */
  timelineEventMarker?: {
    lat: number
    lng: number
    name: string
    year: number
    description?: string
  } | null
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  height = "400px",
  width = "100%",
  className = "",
  layout = "default",
  showBC60 = false,
  showAD14 = false,
  showAD69 = false,
  showAD117 = false,
  showAD200 = false,
  onBC60Change,
  onAD14Change,
  onAD69Change,
  onAD117Change,
  onAD200Change,
  selectedProvinces: externalSelectedProvinces,
  showProvinceLabels: externalShowProvinceLabels = true,
  hideControls = false,
  highlightMint,
  timelineEventMarker,
}) => {
  // Use custom hooks for configuration and data management
  const config = useMapConfiguration()
  const {
    provincesData,
    provincesLabelsData,
    loading: provincesLoading,
  } = useMapData()

  // Local state for map-specific functionality
  const [internalSelectedProvinces, setInternalSelectedProvinces] = useState<
    string[]
  >([...ROMAN_PROVINCES]) // Start with all provinces visible
  const [internalShowProvinceLabels, setInternalShowProvinceLabels] =
    useState(true)
  const [currentZoom, setCurrentZoom] = useState<number>(config.defaultZoom)

  // Custom popup state for mint markers
  const [customPopup, setCustomPopup] = useState<{
    isVisible: boolean
    position: { x: number; y: number }
    content: {
      title: string
      subtitle?: string
      description?: string
      className?: string
    }
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    content: { title: "" },
  })

  // Close popup on scroll
  useEffect(() => {
    if (!customPopup.isVisible) return

    const handleScroll = () => {
      setCustomPopup((prev) => ({ ...prev, isVisible: false }))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [customPopup.isVisible])

  // Province selection logic using custom hook
  const allProvinces = useMemo(() => {
    if (!provincesData) return []
    return provincesData.features
      .map((feature) => feature.properties?.name as string)
      .filter(Boolean)
  }, [provincesData])

  const { isExternallyControlled } = useProvinceSelection(
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

  // Find highlighted mint and center on it if provided
  const highlightedMint = useMemo(() => {
    if (!highlightMint) return null
    return ROMAN_MINTS.find((mint) =>
      mint.mintNames.some(
        (name) => name.toLowerCase() === highlightMint.toLowerCase(),
      ),
    )
  }, [highlightMint])

  // Use actual center and zoom from config if not provided
  // If highlighting a mint, center on that mint
  const mapCenter =
    center ??
    (highlightedMint
      ? [highlightedMint.lat, highlightedMint.lng]
      : config.defaultCenter)
  const mapZoom = zoom ?? (highlightedMint ? 6 : config.defaultZoom) // Zoom level when highlighting a mint

  // Empire extent layer configuration
  const empireLayerConfig = useMemo(
    () =>
      createEmpireLayerConfig(
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
      ),
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
    isLayerVisible,
    getLayerData,
    toggleLayer,
    clearAllEmpireLayers,
    hasAnyEmpireLayerVisible,
  } = useEmpireLayerState(empireLayerConfig)

  // Sync external props with hook state
  useEffect(() => {
    Object.entries(empireLayerConfig).forEach(([key, config]) => {
      if (
        config.showProp !== undefined &&
        isLayerVisible(key) !== config.showProp
      ) {
        toggleLayer(key)
      }
    })
  }, [
    showBC60,
    showAD14,
    showAD69,
    showAD117,
    showAD200,
    empireLayerConfig,
    isLayerVisible,
    toggleLayer,
  ])

  // Enhanced toggle function that also calls onChange callbacks
  const handleToggleLayer = (layerKey: string) => {
    const newValue = !isLayerVisible(layerKey)
    toggleLayer(layerKey)

    // Call onChange callback if it exists
    if (layerKey in empireLayerConfig) {
      const config = empireLayerConfig[layerKey as keyof EmpireLayerConfigMap]
      config?.onChange?.(newValue)
    }
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

    // Show labels only for selected provinces
    return provincesLabelsData.features
      .filter((feature) => {
        const provinceName = feature.properties?.name as string
        return selectedProvinces.includes(provinceName)
      })
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

  useEffect(() => {
    // Fix for Leaflet default markers not showing properly in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions(LEAFLET_ICON_CONFIG)
  }, [])

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

        .timeline-event-marker-container {
          position: relative;
          width: 120px;
          height: 60px;
        }

        .timeline-event-label {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(
            31,
            41,
            55,
            0.95
          ); /* dark gray-800 with transparency */
          color: #f9fafb; /* gray-50 */
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 1px solid #9ca3af; /* gray-400 */
        }

        .timeline-event-circle {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          border: 2px solid #9ca3af; /* gray-400 - brighter border */
          border-radius: 50%;
          background: #374151; /* gray-700 - dark app bg color */
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          transition: all 0.2s ease;
        }

        .timeline-event-tail {
          position: absolute;
          top: 52px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #9ca3af; /* gray-400 - brighter tail */
        }

        .timeline-event-marker:hover .timeline-event-circle {
          transform: translateX(-50%) scale(1.1);
          border-color: #f59e0b; /* amber-500 */
        }

        .timeline-event-marker:hover .timeline-event-tail {
          border-top-color: #f59e0b; /* amber-500 */
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
            empireLayerConfig={empireLayerConfig}
            isLayerVisible={isLayerVisible}
            toggleLayer={handleToggleLayer}
            hasAnyEmpireLayerVisible={hasAnyEmpireLayerVisible}
            clearAllEmpireLayers={clearAllEmpireLayers}
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
              maxBounds={MAP_BOUNDS.maxBounds}
              maxBoundsViscosity={MAP_BOUNDS.maxBoundsViscosity}
              minZoom={config.minZoom}
              maxZoom={config.maxZoom}
            >
              <TileLayer
                url={TILE_LAYER_CONFIG.url}
                attribution={TILE_LAYER_CONFIG.attribution}
                opacity={TILE_LAYER_CONFIG.opacity}
              />

              {/* Zoom Level Handler */}
              <ZoomHandler
                onZoomChange={setCurrentZoom}
                onZoomStart={() =>
                  setCustomPopup((prev) => ({ ...prev, isVisible: false }))
                }
                onPanStart={() =>
                  setCustomPopup((prev) => ({ ...prev, isVisible: false }))
                }
              />

              {/* Map View Controller - handles external center/zoom changes */}
              {center && zoom && (
                <MapViewController center={center} zoom={zoom} />
              )}

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
                  key={`provinces-${selectedProvinces.length === 0 ? "none" : selectedProvinces.length === ROMAN_PROVINCES.length ? "all" : selectedProvinces.join("-")}`}
                  data={(() => {
                    // Filter provinces based on selection:
                    // - Empty array [] = show no provinces
                    // - Full array = show all provinces
                    // - Partial array = show only selected provinces
                    const filteredFeatures = provincesData.features.filter(
                      (feature) => {
                        const provinceName = feature.properties?.name as string
                        return selectedProvinces.includes(provinceName)
                      },
                    )
                    return {
                      type: "FeatureCollection",
                      features: filteredFeatures,
                    } as GeoJSON.FeatureCollection
                  })()}
                  style={MAP_STYLES.provinces}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties && "name" in feature.properties) {
                      const props = feature.properties as { name: string }
                      const name = props.name

                      layer.on("click", (e: L.LeafletMouseEvent) => {
                        const mapContainer = getMapContainer(e)
                        if (!mapContainer) return

                        const rect = mapContainer.getBoundingClientRect()
                        const clickX = e.originalEvent.clientX - rect.left
                        const clickY = e.originalEvent.clientY - rect.top

                        setCustomPopup({
                          isVisible: true,
                          position: {
                            x: rect.left + clickX,
                            y: rect.top + clickY,
                          },
                          content: {
                            title: name,
                            // TODO: hook this up to a data file with info for provinces.
                            description: "Roman Territory",
                            className: "text-emerald-800",
                          },
                        })
                      })
                    }
                  }}
                />
              )}

              {/* Province Labels */}
              {showProvinceLabels &&
                currentZoom > PROVINCE_LABEL_STYLES.minZoomLevel &&
                provinceLabels.map((label) => (
                  <Marker
                    key={`label-${label.name}`}
                    position={label.position}
                    interactive={false}
                    icon={
                      new DivIcon({
                        className: "province-label",
                        html: `<div style="${PROVINCE_LABEL_STYLES.container}">${label.name.replace(/\s/, "\n")}</div>`,
                        iconSize: undefined,
                        iconAnchor: undefined,
                      })
                    }
                  />
                ))}

              {/* Mint Markers */}
              {ROMAN_MINTS.map((mint) => {
                const isHighlighted =
                  highlightedMint?.displayName === mint.displayName

                return (
                  <Marker
                    key={`mint-${mint.displayName}`}
                    position={[mint.lat, mint.lng]}
                    icon={
                      isHighlighted
                        ? new DivIcon({
                            className: "highlighted-mint-marker",
                            html: `<div class="mint-pin-wrapper" data-mint="${mint.displayName}">${createHighlightedMintHtml(mint.displayName)}</div>`,
                            iconSize: [120, 60], // Larger to accommodate label
                            iconAnchor: [60, 12], // Anchor at the center of the circle (24px circle, so 12px from top)
                          })
                        : new DivIcon({
                            className: "mint-marker",
                            html: `<div style="${MAP_STYLES.mintMarker.css}" data-mint="${mint.displayName}"></div>`,
                            iconSize: MAP_STYLES.mintMarker.iconSize,
                            iconAnchor: MAP_STYLES.mintMarker.iconAnchor,
                          })
                    }
                    eventHandlers={{
                      click: (e: L.LeafletMouseEvent) => {
                        const mapContainer = getMapContainer(e)
                        if (!mapContainer) return

                        const rect = mapContainer.getBoundingClientRect()
                        const clickX = e.originalEvent.clientX - rect.left
                        const clickY = e.originalEvent.clientY - rect.top

                        setCustomPopup({
                          isVisible: true,
                          position: {
                            x: rect.left + clickX,
                            y: rect.top + clickY,
                          },
                          content: {
                            title: mint.displayName,
                            subtitle: isHighlighted
                              ? "This coin was struck here"
                              : "",
                            description: mint.flavourText,
                            className: isHighlighted
                              ? "text-purple-800"
                              : "text-blue-800",
                          },
                        })
                      },
                    }}
                  />
                )
              })}

              {/* Timeline Event Marker */}
              {timelineEventMarker && (
                <Marker
                  key={`timeline-event-${timelineEventMarker.year}`}
                  position={[timelineEventMarker.lat, timelineEventMarker.lng]}
                  icon={
                    new DivIcon({
                      className: "timeline-event-marker",
                      html: `
                        <div class="timeline-event-marker-container">
                          <div class="timeline-event-label">${timelineEventMarker.name} (${timelineEventMarker.year})</div>
                          <div class="timeline-event-circle"></div>
                          <div class="timeline-event-tail"></div>
                        </div>
                      `,
                      iconSize: [120, 60], // Width 120px, height 60px (label + circle + tail)
                      iconAnchor: [60, 48], // Anchor at bottom center of tail
                    })
                  }
                  eventHandlers={{
                    click: (e: L.LeafletMouseEvent) => {
                      const mapContainer = getMapContainer(e)
                      if (!mapContainer) return

                      const rect = mapContainer.getBoundingClientRect()
                      const clickX = e.originalEvent.clientX - rect.left
                      const clickY = e.originalEvent.clientY - rect.top

                      setCustomPopup({
                        isVisible: true,
                        position: {
                          x: rect.left + clickX,
                          y: rect.top + clickY,
                        },
                        content: {
                          title: "", // No heading
                          description:
                            timelineEventMarker.description ??
                            "Timeline Event Location",
                          className: "text-center",
                        },
                      })
                    },
                  }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Custom popup that renders outside map container */}
      <MapPopup
        isVisible={customPopup.isVisible}
        onClose={() =>
          setCustomPopup((prev) => ({ ...prev, isVisible: false }))
        }
        position={customPopup.position}
        content={customPopup.content}
      />
    </>
  )
}
