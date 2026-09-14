"use client"

import "maplibre-gl/dist/maplibre-gl.css"
import type {
  MapGeoJSONFeature,
  Map as MapLibreMap,
  MapLayerMouseEvent,
} from "maplibre-gl"
import { setWorkerUrl } from "maplibre-gl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Layer, Map as MapGL, Marker, Source } from "react-map-gl/maplibre"
import type { MapRef } from "react-map-gl/maplibre"
import { useMints } from "~/api/mints"
import { MAP_HEIGHT } from "~/lib/constants"
import { formatYear } from "~/lib/utils/date-formatting"
import { ROMAN_PROVINCES } from "./constants/provinces"
import {
  useEmpireLayerState,
  useMapConfiguration,
  useMapData,
  useProvinceSelection,
} from "./hooks"
import {
  MAP_BOUNDS_LNGLAT,
  MAP_STYLE_URL,
  MAP_STYLES,
  PROVINCE_LABEL_STYLES,
  createEmpireLayerConfig,
  type EmpireLayerConfigMap,
} from "./mapConfig"
import { MapEmbeddedControls } from "./MapEmbeddedControls"
import {
  buildClusteredCustomMarkers,
  buildMarkerLookup,
  createCustomMarkerClusterIndex,
  createSpiderfyPositions,
  getCoordinateKey,
  type ClusteredMarker,
  type SpiderfiedClusterState,
} from "./mapMarkerClustering"
import {
  createClusterMarkerHtml,
  createCustomMarkerHtml,
  createSpiderfiedMarkerHtml,
  type CustomMapMarker,
} from "./mapMarkers"
import { MapPopup } from "./MapPopup"
import { HighlightedMintSvg } from "./MintMarkerSvg"

export type { CustomMapMarker } from "./mapMarkers"

// maplibre-gl resolves its worker script's URL via import.meta.url at
// runtime, which only works when the module is served unbundled -- Next's
// webpack build rewrites it, so the auto-detected URL comes back empty and
// every vector/geojson source silently never finishes loading (raster
// sources still work, since they don't need the worker). Point it at the
// static copy instead -- see scripts/copy-maplibre-assets.mjs for how that
// file gets there and stays in sync with the installed maplibre-gl version.
setWorkerUrl("/maplibre-gl-worker.mjs")

type ViewportBounds = [number, number, number, number]

type PopupContent = {
  title: string
  subtitle?: string
  description?: string
  className?: string
}

function sanitizeCssDimension(value: string, fallback: string): string {
  return /^[0-9a-zA-Z.%(),\s-]+$/.test(value) ? value : fallback
}

// Hide the basemap style's own modern place-name labels (cities, towns,
// countries, ...) -- they're anachronistic clutter next to a Roman
// province overlay. Matched by source-layer rather than a hardcoded list
// of layer ids, so it stays correct if OpenFreeMap's style adds/renames
// label layers later.
function hideModernPlaceLabels(map: MapLibreMap) {
  for (const layer of map.getStyle().layers) {
    if ("source-layer" in layer && layer["source-layer"] === "place") {
      map.setLayoutProperty(layer.id, "visibility", "none")
    }
  }
}

export type MapProps = {
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
  /** Whether default mint markers from the mints table should be displayed */
  showMintMarkers?: boolean
  /** Custom markers to render for coin detail pages and other specialized views */
  customMarkers?: CustomMapMarker[]
  /** Timeline event marker to show on the map */
  timelineEventMarker?: {
    lat: number
    lng: number
    name: string
    year: number
    description?: string
  } | null
  /** Whether the default single highlighted timeline event marker should be displayed */
  showTimelineEventMarker?: boolean
  /** Callback to receive the navigate function */
  onNavigate?: (
    navigateFn: (center: [number, number], zoom: number) => void,
  ) => void
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  height = MAP_HEIGHT,
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
  showMintMarkers = true,
  customMarkers = [],
  timelineEventMarker,
  showTimelineEventMarker = true,
  onNavigate,
}) => {
  // Validate and sanitize center prop to prevent NaN coordinates
  const safeCenter = useMemo((): [number, number] => {
    if (!center || !Array.isArray(center) || center.length !== 2) {
      return [41.9028, 12.4964] // Rome default
    }

    const [lat, lng] = center
    // Explicitly convert to numbers in case they're strings
    const numLat = typeof lat === "string" ? Number(lat) : lat
    const numLng = typeof lng === "string" ? Number(lng) : lng

    const safeLat =
      typeof numLat === "number" && isFinite(numLat) && !isNaN(numLat)
        ? numLat
        : 41.9028
    const safeLng =
      typeof numLng === "number" && isFinite(numLng) && !isNaN(numLng)
        ? numLng
        : 12.4964

    return [safeLat, safeLng]
  }, [center])

  // Validate and sanitize zoom prop
  const safeZoom = useMemo(() => {
    const numZoom = typeof zoom === "string" ? Number(zoom) : zoom

    if (
      typeof numZoom !== "number" ||
      !isFinite(numZoom) ||
      isNaN(numZoom) ||
      numZoom <= 0
    ) {
      return 5
    }
    return numZoom
  }, [zoom])

  // Use custom hooks for configuration and data management
  const config = useMapConfiguration()
  const { data: mints } = useMints()
  const {
    provincesData,
    provincesLabelsData,
    loading: provincesLoading,
  } = useMapData()

  const mapRef = useRef<MapRef>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Local state for map-specific functionality
  const [internalSelectedProvinces, setInternalSelectedProvinces] = useState<
    string[]
  >([...ROMAN_PROVINCES]) // Start with all provinces visible
  const [internalShowProvinceLabels, setInternalShowProvinceLabels] =
    useState(true)
  const [currentZoom, setCurrentZoom] = useState<number>(config.defaultZoom)
  const [viewportBounds, setViewportBounds] =
    useState<ViewportBounds>(MAP_BOUNDS_LNGLAT)

  // Custom popup state for mint markers
  const [customPopup, setCustomPopup] = useState<{
    isVisible: boolean
    position: { x: number; y: number }
    content: PopupContent
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    content: { title: "" },
  })
  const [spiderfiedCluster, setSpiderfiedCluster] =
    useState<SpiderfiedClusterState | null>(null)

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

  useEffect(() => {
    setSpiderfiedCluster(null)
  }, [customMarkers])

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
    if (!highlightMint || !mints) return null
    return mints.find(
      (mint) =>
        mint.alt_names?.some(
          (name) => name.toLowerCase() === highlightMint.toLowerCase(),
        ) ?? mint.name.toLowerCase() === highlightMint.toLowerCase(),
    )
  }, [highlightMint, mints])

  const activeCustomMarkers = useMemo(
    () => customMarkers.filter((marker) => marker.isActive),
    [customMarkers],
  )

  const clusterableCustomMarkers = useMemo(
    () => customMarkers.filter((marker) => !marker.isActive),
    [customMarkers],
  )

  const markerLookup = useMemo(() => {
    return buildMarkerLookup(clusterableCustomMarkers)
  }, [clusterableCustomMarkers])

  const customMarkerClusterIndex = useMemo(() => {
    return createCustomMarkerClusterIndex(clusterableCustomMarkers)
  }, [clusterableCustomMarkers])

  const clusteredCustomMarkers = useMemo(() => {
    return buildClusteredCustomMarkers({
      activeCustomMarkers,
      currentZoom,
      customMarkerClusterIndex,
      markerLookup,
      viewportBounds,
    })
  }, [
    activeCustomMarkers,
    currentZoom,
    customMarkerClusterIndex,
    markerLookup,
    viewportBounds,
  ])

  const openPopup = useCallback(
    (clientX: number, clientY: number, content: PopupContent) => {
      setCustomPopup({
        isVisible: true,
        position: { x: clientX, y: clientY },
        content,
      })
    },
    [],
  )

  const handleCustomMarkerClick = useCallback(
    (marker: CustomMapMarker, originalEvent: MouseEvent) => {
      marker.onClick?.()

      if (
        marker.showPopup === false ||
        (!marker.title && !marker.subtitle && !marker.description)
      ) {
        return
      }

      openPopup(originalEvent.clientX, originalEvent.clientY, {
        title: marker.title,
        subtitle: marker.subtitle,
        description: marker.description ?? "",
        className: marker.className ?? "text-slate-100",
      })
    },
    [openPopup],
  )

  const handleClusterClick = useCallback(
    (item: Extract<ClusteredMarker, { type: "cluster" }>, map: MapLibreMap) => {
      if (!customMarkerClusterIndex) return

      const leaves = customMarkerClusterIndex.getLeaves(item.id, item.count)
      const markers = leaves
        .map((leaf) => {
          const markerId = leaf.properties?.markerId
          return markerId ? markerLookup[markerId] : null
        })
        .filter((marker): marker is CustomMapMarker => marker !== null)

      if (markers.length === 0) {
        return
      }

      const coordinateKeys = new Set(
        markers.map((marker) => getCoordinateKey(marker.lat, marker.lng)),
      )

      if (coordinateKeys.size === 1) {
        setSpiderfiedCluster((current) => {
          if (current?.clusterId === item.id) {
            return null
          }

          return {
            clusterId: item.id,
            markers: createSpiderfyPositions({
              map,
              center: [item.lat, item.lng],
              markers,
            }),
          }
        })
        return
      }

      setSpiderfiedCluster(null)
      map.flyTo({
        center: [item.lng, item.lat],
        zoom: item.expansionZoom,
        duration: 600,
      })
    },
    [customMarkerClusterIndex, markerLookup],
  )

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

        const [lng, lat] = feature.geometry.coordinates as [number, number]

        return { name, lng, lat }
      })
      .filter(
        (label): label is { name: string; lng: number; lat: number } =>
          label !== null,
      )
  }, [provincesLabelsData, selectedProvinces])

  // GeoJSON for the provinces overlay, filtered to the current selection
  const filteredProvincesGeoJSON = useMemo(() => {
    if (!provincesData) return null

    const filteredFeatures = provincesData.features.filter((feature) => {
      const provinceName = feature.properties?.name as string
      return selectedProvinces.includes(provinceName)
    })

    return {
      type: "FeatureCollection",
      features: filteredFeatures,
    } as GeoJSON.FeatureCollection
  }, [provincesData, selectedProvinces])

  // GeoJSON for the spiderfy "leg" lines connecting a cluster center to its
  // fanned-out markers
  const spiderLegsGeoJSON = useMemo((): GeoJSON.FeatureCollection => {
    if (!spiderfiedCluster) {
      return { type: "FeatureCollection", features: [] }
    }

    return {
      type: "FeatureCollection",
      features: spiderfiedCluster.markers.map((item) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [item.leg[0][1], item.leg[0][0]],
            [item.leg[1][1], item.leg[1][0]],
          ],
        },
      })),
    }
  }, [spiderfiedCluster])

  // Layer ids currently eligible for click interaction -- must match
  // whichever fill layers are actually mounted below, or MapLibre has
  // nothing to hit-test against.
  const interactiveLayerIds = useMemo(() => {
    const ids: string[] = []
    if (filteredProvincesGeoJSON) {
      ids.push("provinces-fill")
    }
    for (const key of Object.keys(empireLayerConfig)) {
      if (isLayerVisible(key) && getLayerData(key)) {
        ids.push(`${key}-fill`)
      }
    }
    return ids
  }, [
    filteredProvincesGeoJSON,
    empireLayerConfig,
    isLayerVisible,
    getLayerData,
  ])

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      setSpiderfiedCluster(null)

      const feature: MapGeoJSONFeature | undefined = e.features?.[0]
      if (!feature?.layer) return

      const layerId = feature.layer.id

      if (layerId === "provinces-fill") {
        const name = feature.properties?.name as string | undefined
        if (!name) return

        openPopup(e.originalEvent.clientX, e.originalEvent.clientY, {
          title: name,
          // TODO: hook this up to a data file with info for provinces.
          description: "Roman Territory",
          className: "text-emerald-800",
        })
        return
      }

      const empireLayer = Object.values(empireLayerConfig).find(
        (layerConfig) => `${layerConfig.id}-fill` === layerId,
      )
      if (empireLayer) {
        openPopup(e.originalEvent.clientX, e.originalEvent.clientY, {
          title: empireLayer.title,
          description: empireLayer.description,
        })
      }
    },
    [empireLayerConfig, openPopup],
  )

  // Register the imperative navigate function with the parent once the map
  // has finished loading. Mirrors the size checks a hidden/collapsed map
  // container would otherwise fail on (a zero-size canvas can't flyTo).
  useEffect(() => {
    if (!mapLoaded || !onNavigate) return

    const map = mapRef.current?.getMap()
    if (!map) return

    let isDisposed = false

    const timeoutId = window.setTimeout(() => {
      if (isDisposed) return

      try {
        map.resize()
        const canvas = map.getCanvas()
        if (!(canvas.clientWidth > 0 && canvas.clientHeight > 0)) return

        const navigate = (center: [number, number], zoom: number) => {
          if (isDisposed) return

          const [lat, lng] = center
          const numLat = typeof lat === "string" ? Number(lat) : lat
          const numLng = typeof lng === "string" ? Number(lng) : lng
          const numZoom = typeof zoom === "string" ? Number(zoom) : zoom

          if (
            typeof numLat !== "number" ||
            typeof numLng !== "number" ||
            typeof numZoom !== "number" ||
            !isFinite(numLat) ||
            !isFinite(numLng) ||
            !isFinite(numZoom) ||
            isNaN(numLat) ||
            isNaN(numLng) ||
            isNaN(numZoom) ||
            numZoom <= 0
          ) {
            return
          }

          let liveCanvas: HTMLCanvasElement | null = null
          try {
            liveCanvas = map.getCanvas()
          } catch {
            return
          }
          if (!liveCanvas?.isConnected) return

          const currentCenter = map.getCenter()
          const hasValidCurrentCenter =
            currentCenter &&
            !isNaN(currentCenter.lat) &&
            !isNaN(currentCenter.lng) &&
            isFinite(currentCenter.lat) &&
            isFinite(currentCenter.lng)

          const hasValidSize =
            liveCanvas.clientWidth > 0 && liveCanvas.clientHeight > 0

          if (!hasValidSize) {
            map.resize()
          }

          try {
            if (hasValidCurrentCenter && hasValidSize) {
              map.flyTo({
                center: [numLng, numLat],
                zoom: numZoom,
                duration: 1500,
              })
            } else {
              map.jumpTo({ center: [numLng, numLat], zoom: numZoom })
            }
          } catch {
            // Ignore navigation attempts on disposed/hidden maps
          }
        }

        onNavigate(navigate)
      } catch {
        // Ignore setup errors for hidden or unmounted maps
      }
    }, 100)

    return () => {
      isDisposed = true
      window.clearTimeout(timeoutId)
    }
  }, [mapLoaded, onNavigate])

  // Apply custom dimensions if provided, otherwise use Tailwind defaults
  const safeHeight = sanitizeCssDimension(height, MAP_HEIGHT)
  const safeWidth = sanitizeCssDimension(width, "100%")

  const updateViewportBounds = useCallback((map: MapLibreMap) => {
    const bounds = map.getBounds()
    setViewportBounds([
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ])
  }, [])

  return (
    <>
      {/* Custom CSS for the timeline event marker template */}
      <style jsx global>{`
        .map-shell-default {
          height: ${safeHeight};
        }

        .map-shell-sized {
          height: ${safeHeight};
          width: ${safeWidth};
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
              : `map-shell-default relative ${width === "100%" ? "w-full" : ""}`
          }
        >
          <div
            className={
              layout === "fullscreen"
                ? "relative h-full w-full"
                : `map-shell-sized relative ${width === "100%" ? "w-full" : ""}`
            }
          >
            <MapGL
              ref={mapRef}
              initialViewState={{
                longitude: safeCenter[1],
                latitude: safeCenter[0],
                zoom: safeZoom,
              }}
              mapStyle={MAP_STYLE_URL}
              style={{ width: "100%", height: "100%" }}
              maxBounds={MAP_BOUNDS_LNGLAT}
              minZoom={config.minZoom}
              maxZoom={config.maxZoom}
              keyboard={false}
              interactiveLayerIds={interactiveLayerIds}
              onLoad={(e) => {
                setMapLoaded(true)
                updateViewportBounds(e.target)
                hideModernPlaceLabels(e.target)
              }}
              onZoomEnd={(e) => {
                setCurrentZoom(e.viewState.zoom)
                updateViewportBounds(e.target)
              }}
              onMoveEnd={(e) => updateViewportBounds(e.target)}
              onMoveStart={() => {
                setCustomPopup((prev) => ({ ...prev, isVisible: false }))
                setSpiderfiedCluster(null)
              }}
              onClick={handleMapClick}
            >
              {/* Empire extent layers */}
              {Object.entries(empireLayerConfig).map(([key, layerConfig]) => {
                const data = getLayerData(key)
                if (!isLayerVisible(key) || !data) return null

                return (
                  <Source key={key} id={key} type="geojson" data={data}>
                    <Layer
                      id={`${key}-fill`}
                      type="fill"
                      paint={{
                        "fill-color": layerConfig.style.fillColor,
                        "fill-opacity": layerConfig.style.fillOpacity,
                      }}
                    />
                    <Layer
                      id={`${key}-line`}
                      type="line"
                      paint={{
                        "line-color": layerConfig.style.lineColor,
                        "line-width": layerConfig.style.lineWidth,
                        "line-opacity": layerConfig.style.lineOpacity,
                        "line-dasharray": layerConfig.style.lineDasharray,
                      }}
                    />
                  </Source>
                )
              })}

              {/* Selected Provinces Layer */}
              {filteredProvincesGeoJSON && (
                <Source
                  id="provinces"
                  type="geojson"
                  data={filteredProvincesGeoJSON}
                >
                  <Layer
                    id="provinces-fill"
                    type="fill"
                    paint={{
                      "fill-color": MAP_STYLES.provinces.fillColor,
                      "fill-opacity": MAP_STYLES.provinces.fillOpacity,
                    }}
                  />
                  <Layer
                    id="provinces-line"
                    type="line"
                    paint={{
                      "line-color": MAP_STYLES.provinces.lineColor,
                      "line-width": MAP_STYLES.provinces.lineWidth,
                      "line-opacity": MAP_STYLES.provinces.lineOpacity,
                      "line-dasharray": MAP_STYLES.provinces.lineDasharray,
                    }}
                  />
                </Source>
              )}

              {/* Province Labels */}
              {showProvinceLabels &&
                currentZoom > PROVINCE_LABEL_STYLES.minZoomLevel &&
                provinceLabels.map((label) => (
                  <Marker
                    key={`label-${label.name}`}
                    longitude={label.lng}
                    latitude={label.lat}
                    anchor="center"
                  >
                    <div style={PROVINCE_LABEL_STYLES.container}>
                      {label.name.replace(/\s/, "\n")}
                    </div>
                  </Marker>
                ))}

              {/* Mint Markers */}
              {showMintMarkers &&
                mints?.map((mint) => {
                  const isHighlighted = highlightedMint?.name === mint.name

                  return (
                    <Marker
                      key={`mint-${mint.name}`}
                      longitude={mint.lng}
                      latitude={mint.lat}
                      anchor={isHighlighted ? "bottom" : "center"}
                      onClick={(e) =>
                        openPopup(
                          e.originalEvent.clientX,
                          e.originalEvent.clientY,
                          {
                            title: mint.name,
                            subtitle: isHighlighted
                              ? "This coin was struck here"
                              : "",
                            description: mint.flavour_text ?? "",
                            className: isHighlighted
                              ? "text-purple-900"
                              : "text-blue-800",
                          },
                        )
                      }
                    >
                      {isHighlighted ? (
                        <HighlightedMintSvg displayName={mint.name} />
                      ) : (
                        <div
                          style={MAP_STYLES.mintMarker.style}
                          data-mint={mint.name}
                        />
                      )}
                    </Marker>
                  )
                })}

              {/* Custom Markers */}
              {clusteredCustomMarkers.map((item) => {
                if (item.type === "cluster") {
                  const isSpiderfied = spiderfiedCluster?.clusterId === item.id

                  if (isSpiderfied) {
                    return null
                  }

                  return (
                    <Marker
                      key={`custom-cluster-${item.id}`}
                      longitude={item.lng}
                      latitude={item.lat}
                      anchor="center"
                      onClick={(e) => {
                        const map = mapRef.current?.getMap()
                        if (map) handleClusterClick(item, map)
                        e.originalEvent.stopPropagation()
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: createClusterMarkerHtml(item.count),
                        }}
                      />
                    </Marker>
                  )
                }

                const marker = item.marker

                return (
                  <Marker
                    key={marker.id}
                    longitude={marker.lng}
                    latitude={marker.lat}
                    anchor="bottom"
                    onClick={(e) => {
                      handleCustomMarkerClick(marker, e.originalEvent)
                      e.originalEvent.stopPropagation()
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: createCustomMarkerHtml(marker),
                      }}
                    />
                  </Marker>
                )
              })}

              {spiderfiedCluster && (
                <Source
                  id="spider-legs"
                  type="geojson"
                  data={spiderLegsGeoJSON}
                >
                  <Layer
                    id="spider-legs-line"
                    type="line"
                    paint={{
                      "line-color": "rgba(15, 23, 42, 0.55)",
                      "line-width": 2,
                      "line-opacity": 0.9,
                    }}
                  />
                </Source>
              )}

              {spiderfiedCluster?.markers.map((item) => {
                const marker = item.marker

                return (
                  <Marker
                    key={`spiderfied-${marker.id}`}
                    longitude={item.position[1]}
                    latitude={item.position[0]}
                    anchor="bottom"
                    onClick={(e) => {
                      handleCustomMarkerClick(marker, e.originalEvent)
                      e.originalEvent.stopPropagation()
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: createSpiderfiedMarkerHtml(marker),
                      }}
                    />
                  </Marker>
                )
              })}

              {/* Timeline Event Marker */}
              {showTimelineEventMarker &&
                timelineEventMarker &&
                typeof timelineEventMarker.lat === "number" &&
                typeof timelineEventMarker.lng === "number" &&
                !isNaN(timelineEventMarker.lat) &&
                !isNaN(timelineEventMarker.lng) &&
                isFinite(timelineEventMarker.lat) &&
                isFinite(timelineEventMarker.lng) && (
                  <Marker
                    key={`timeline-event-${timelineEventMarker.year}`}
                    longitude={timelineEventMarker.lng}
                    latitude={timelineEventMarker.lat}
                    anchor="bottom"
                    onClick={(e) =>
                      openPopup(
                        e.originalEvent.clientX,
                        e.originalEvent.clientY,
                        {
                          title: "",
                          description:
                            timelineEventMarker.description ??
                            "Timeline Event Location",
                          className: "text-center",
                        },
                      )
                    }
                  >
                    <div
                      className="timeline-event-marker"
                      dangerouslySetInnerHTML={{
                        __html: `
                        <div class="timeline-event-marker-container">
                          <div class="timeline-event-label">${timelineEventMarker.name} (${formatYear(timelineEventMarker.year)})</div>
                          <div class="timeline-event-circle"></div>
                          <div class="timeline-event-tail"></div>
                        </div>
                      `,
                      }}
                    />
                  </Marker>
                )}
            </MapGL>
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
