"use client"

import L, { DivIcon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  GeoJSON,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet"
import Supercluster from "supercluster"
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return (event.target as any)?._map?._container ?? null
}

function getLeafletMap(event: L.LeafletMouseEvent): L.Map | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return (event.target as any)?._map ?? null
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function createReverseTeardropMarkerHtml({
  fillColor,
  borderColor,
  iconSrc,
  active = false,
  sizeScale = 1,
}: {
  fillColor: string
  borderColor: string
  iconSrc?: string
  active?: boolean
  sizeScale?: number
}) {
  const size = Math.round((active ? 34 : 30) * sizeScale)
  const safeIconSrc = iconSrc ? escapeHtml(iconSrc) : null
  const iconSize = Math.max(10, Math.round((active ? 18 : 16) * sizeScale))
  const borderWidth = Math.max(2, Math.round((active ? 3 : 2) * sizeScale))
  const containerHeight = size + Math.round(10 * sizeScale)
  const iconTop = Math.round((active ? 11 : 10) * sizeScale)
  const fallbackDotSize = Math.max(5, Math.round(8 * sizeScale))

  return `
    <div style="position: relative; width: ${size}px; height: ${containerHeight}px;">
      <div
        style="
          position: absolute;
          left: 50%;
          top: 1px;
          width: ${size}px;
          height: ${size}px;
          transform: translateX(-50%) rotate(-45deg);
          transform-origin: center;
          border-radius: 50% 50% 50% 0;
          background: ${fillColor};
          border: ${borderWidth}px solid ${borderColor};
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.35);
        "
      ></div>
      <div
        style="
          position: absolute;
          left: 50%;
          top: ${iconTop}px;
          width: ${iconSize}px;
          height: ${iconSize}px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        "
      >
        ${
          safeIconSrc
            ? `<img src="${safeIconSrc}" alt="" style="width: ${iconSize}px; height: ${iconSize}px; object-fit: contain; filter: brightness(0) invert(1);" />`
            : `<div style="width: ${fallbackDotSize}px; height: ${fallbackDotSize}px; border-radius: 9999px; background: rgba(255,255,255,0.92);"></div>`
        }
      </div>
    </div>
  `
}

export type CustomMapMarker = {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  description?: string
  className?: string
  fillColor: string
  borderColor: string
  iconSrc?: string
  sizeScale?: number
  isActive?: boolean
  showPopup?: boolean
  onClick?: () => void
  zIndexOffset?: number
}

type ViewportBounds = [number, number, number, number]

type ClusterFeatureProperties = {
  cluster?: boolean
  cluster_id?: number
  point_count?: number
  point_count_abbreviated?: string | number
  markerId?: string
}

type SpiderfiedMarker = {
  marker: CustomMapMarker
  position: [number, number]
  leg: [[number, number], [number, number]]
}

type SpiderfiedClusterState = {
  clusterId: number
  markers: SpiderfiedMarker[]
}

type ClusteredMarker =
  | {
      type: "cluster"
      id: number
      lat: number
      lng: number
      count: number
      expansionZoom: number
    }
  | {
      type: "marker"
      marker: CustomMapMarker
    }

function createClusterMarkerHtml(count: number) {
  const size = count >= 10 ? 42 : 38

  return `
    <div style="position: relative; width: ${size}px; height: ${size}px;">
      <div
        style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #1e293b 0%, #0f172a 58%, #020617 100%);
          border: 2px solid rgba(250, 204, 21, 0.95);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.32), 0 0 0 6px rgba(15, 23, 42, 0.2);
        "
      ></div>
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8fafc;
          font-size: ${count >= 100 ? 11 : 12}px;
          font-weight: 700;
          letter-spacing: 0.02em;
        "
      >${count}</div>
    </div>
  `
}

function sanitizeCssDimension(value: string, fallback: string): string {
  return /^[0-9a-zA-Z.%(),\s-]+$/.test(value) ? value : fallback
}

function getCoordinateKey(lat: number, lng: number): string {
  return `${lat.toFixed(6)}:${lng.toFixed(6)}`
}

function createSpiderfyPositions({
  map,
  center,
  markers,
}: {
  map: L.Map
  center: [number, number]
  markers: CustomMapMarker[]
}): SpiderfiedMarker[] {
  const markerCount = markers.length

  if (markerCount === 0) {
    return []
  }

  const centerLatLng = L.latLng(center[0], center[1])
  const centerPoint = map.latLngToLayerPoint(centerLatLng)

  return markers.map((marker, index) => {
    let offsetX = 0
    let offsetY = 0

    if (markerCount <= 8) {
      const angle = (Math.PI * 2 * index) / markerCount - Math.PI / 2
      const radius = markerCount <= 3 ? 28 : 38
      offsetX = Math.cos(angle) * radius
      offsetY = Math.sin(angle) * radius
    } else {
      const angle = index * 0.7
      const radius = 26 + index * 5
      offsetX = Math.cos(angle) * radius
      offsetY = Math.sin(angle) * radius
    }

    const spiderPoint = L.point(
      centerPoint.x + offsetX,
      centerPoint.y + offsetY,
    )
    const spiderLatLng = map.layerPointToLatLng(spiderPoint)
    const position: [number, number] = [spiderLatLng.lat, spiderLatLng.lng]

    return {
      marker,
      position,
      leg: [center, position],
    }
  })
}

// Component to handle zoom level changes and pan events
function ZoomHandler({
  onZoomChange,
  onZoomStart,
  onPanStart,
  onViewportChange,
  onMapClick,
}: {
  onZoomChange: (zoom: number) => void
  onZoomStart?: () => void
  onPanStart?: () => void
  onViewportChange?: (bounds: ViewportBounds) => void
  onMapClick?: () => void
}) {
  const map = useMapEvents({
    zoomstart: () => {
      onZoomStart?.()
    },
    zoomend: (e) => {
      const nextMap = e.target as L.Map
      const zoom = nextMap.getZoom()
      onZoomChange(zoom)
      const bounds = nextMap.getBounds()
      onViewportChange?.([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ])
    },
    movestart: () => {
      // Close popups when user starts panning/dragging the map
      onPanStart?.()
    },
    moveend: (e) => {
      const bounds = (e.target as L.Map).getBounds()
      onViewportChange?.([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ])
    },
    click: () => {
      onMapClick?.()
    },
  })

  useEffect(() => {
    const bounds = map.getBounds()
    onViewportChange?.([
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ])
  }, [map, onViewportChange])

  return null
}

// Component to expose map navigation function to parent
function MapNavigationHandler({
  onNavigate,
}: {
  onNavigate?: (
    navigateFn: (center: [number, number], zoom: number) => void,
  ) => void
}) {
  const map = useMapEvents({})

  useEffect(() => {
    if (!onNavigate || !map) return

    let isDisposed = false

    // Force map to recalculate size on mount (important for mobile)
    const timeoutId = window.setTimeout(() => {
      if (isDisposed) return

      try {
        const container = map.getContainer()
        if (!container?.isConnected) return

        map.invalidateSize()
        const size = map.getSize()

        // Only register navigate function if map has valid size
        // This prevents hidden/collapsed maps from overwriting the active map's navigate function
        if (size && size.x > 0 && size.y > 0) {
          // Create navigation function and pass to parent
          const navigate = (center: [number, number], zoom: number) => {
            if (isDisposed) return

            let liveContainer: HTMLElement | null = null

            try {
              liveContainer = map.getContainer()
            } catch {
              return
            }

            if (!liveContainer?.isConnected) return

            // Validate coordinates
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

            const cleanCenter: [number, number] = [numLat, numLng]

            // Check if map's current center is valid
            const currentCenter = map.getCenter()
            const hasValidCurrentCenter =
              currentCenter &&
              !isNaN(currentCenter.lat) &&
              !isNaN(currentCenter.lng) &&
              isFinite(currentCenter.lat) &&
              isFinite(currentCenter.lng)

            // Check if map container has valid size (flyTo can fail with invalid container size)
            const mapSize = map.getSize()
            const hasValidSize = mapSize && mapSize.x > 0 && mapSize.y > 0

            // If map size is invalid, force recalculation
            if (!hasValidSize) {
              map.invalidateSize()
            }

            try {
              // Use setView if current position or map size is invalid, flyTo if both are valid
              // This prevents NaN errors during flyTo animation when container is collapsed/hidden
              if (hasValidCurrentCenter && hasValidSize) {
                map.flyTo(cleanCenter, numZoom, {
                  animate: true,
                  duration: 1.5,
                })
              } else {
                map.setView(cleanCenter, numZoom)
              }
            } catch {
              // Ignore navigation attempts on disposed/hidden maps
            }
          }

          // Expose to parent (only for maps with valid size)
          if (onNavigate) {
            onNavigate(navigate)
          }
        }
      } catch {
        // Ignore setup errors for hidden or unmounted maps
      }
    }, 100)

    return () => {
      isDisposed = true
      window.clearTimeout(timeoutId)
    }
  }, [map, onNavigate])

  return null
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

  // Local state for map-specific functionality
  const [internalSelectedProvinces, setInternalSelectedProvinces] = useState<
    string[]
  >([...ROMAN_PROVINCES]) // Start with all provinces visible
  const [internalShowProvinceLabels, setInternalShowProvinceLabels] =
    useState(true)
  const [currentZoom, setCurrentZoom] = useState<number>(config.defaultZoom)
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds>([
    MAP_BOUNDS.maxBounds[0][1],
    MAP_BOUNDS.maxBounds[1][0],
    MAP_BOUNDS.maxBounds[1][1],
    MAP_BOUNDS.maxBounds[0][0],
  ])

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
    const lookup: Record<string, CustomMapMarker> = {}

    for (const marker of clusterableCustomMarkers) {
      lookup[marker.id] = marker
    }

    return lookup
  }, [clusterableCustomMarkers])

  const customMarkerClusterIndex = useMemo(() => {
    if (clusterableCustomMarkers.length === 0) {
      return null
    }

    const index = new Supercluster<ClusterFeatureProperties>({
      radius: 52,
      maxZoom: 17,
      minZoom: 0,
    })

    index.load(
      clusterableCustomMarkers.map((marker) => ({
        type: "Feature" as const,
        properties: {
          markerId: marker.id,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [marker.lng, marker.lat] as [number, number],
        },
      })),
    )

    return index
  }, [clusterableCustomMarkers])

  const clusteredCustomMarkers = useMemo(() => {
    if (!customMarkerClusterIndex) {
      return activeCustomMarkers.map((marker) => ({
        type: "marker" as const,
        marker,
      }))
    }

    const zoomLevel = Math.max(0, Math.round(currentZoom))

    const clusteredMarkers: ClusteredMarker[] = []

    for (const feature of customMarkerClusterIndex.getClusters(
      viewportBounds,
      zoomLevel,
    )) {
      const [lng, lat] = feature.geometry.coordinates
      const properties = feature.properties ?? {}

      if (properties.cluster && properties.cluster_id !== undefined) {
        clusteredMarkers.push({
          type: "cluster",
          id: properties.cluster_id,
          lat,
          lng,
          count: properties.point_count ?? 0,
          expansionZoom: customMarkerClusterIndex.getClusterExpansionZoom(
            properties.cluster_id,
          ),
        })
        continue
      }

      if (!properties.markerId) {
        continue
      }

      const marker = markerLookup[properties.markerId]
      if (marker) {
        clusteredMarkers.push({
          type: "marker",
          marker,
        })
      }
    }

    return clusteredMarkers.concat(
      activeCustomMarkers.map((marker) => ({
        type: "marker" as const,
        marker,
      })),
    )
  }, [
    activeCustomMarkers,
    currentZoom,
    customMarkerClusterIndex,
    markerLookup,
    viewportBounds,
  ])

  const openPopupFromMouseEvent = useCallback(
    (
      e: L.LeafletMouseEvent,
      content: {
        title: string
        subtitle?: string
        description?: string
        className?: string
      },
    ) => {
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
        content,
      })
    },
    [],
  )

  const handleCustomMarkerClick = useCallback(
    (marker: CustomMapMarker, e: L.LeafletMouseEvent) => {
      marker.onClick?.()

      if (
        marker.showPopup === false ||
        (!marker.title && !marker.subtitle && !marker.description)
      ) {
        return
      }

      openPopupFromMouseEvent(e, {
        title: marker.title,
        subtitle: marker.subtitle,
        description: marker.description ?? "",
        className: marker.className ?? "text-slate-100",
      })
    },
    [openPopupFromMouseEvent],
  )

  const handleClusterClick = useCallback(
    (
      item: Extract<ClusteredMarker, { type: "cluster" }>,
      e: L.LeafletMouseEvent,
    ) => {
      const map = getLeafletMap(e)
      if (!map || !customMarkerClusterIndex) return

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
      map.flyTo([item.lat, item.lng], item.expansionZoom, {
        animate: true,
        duration: 0.6,
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
  const safeHeight = sanitizeCssDimension(height, MAP_HEIGHT)
  const safeWidth = sanitizeCssDimension(width, "100%")

  return (
    <>
      {/* Custom CSS for province labels */}
      <style jsx global>{`
        .province-label {
          /* No background - transparent labels */
        }

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
            <MapContainer
              center={safeCenter}
              zoom={safeZoom}
              className="h-full w-full"
              maxBounds={MAP_BOUNDS.maxBounds}
              maxBoundsViscosity={MAP_BOUNDS.maxBoundsViscosity}
              minZoom={config.minZoom}
              maxZoom={config.maxZoom}
              keyboard={false}
              zoomControl={false}
            >
              <TileLayer
                url={TILE_LAYER_CONFIG.url}
                attribution={TILE_LAYER_CONFIG.attribution}
                opacity={TILE_LAYER_CONFIG.opacity}
              />

              {/* Zoom Level Handler */}
              <ZoomHandler
                onZoomChange={setCurrentZoom}
                onZoomStart={() => {
                  setCustomPopup((prev) => ({ ...prev, isVisible: false }))
                  setSpiderfiedCluster(null)
                }}
                onPanStart={() => {
                  setCustomPopup((prev) => ({ ...prev, isVisible: false }))
                  setSpiderfiedCluster(null)
                }}
                onViewportChange={setViewportBounds}
                onMapClick={() => {
                  setSpiderfiedCluster(null)
                }}
              />

              {/* Map Navigation Handler - exposes navigation function to parent */}
              <MapNavigationHandler onNavigate={onNavigate} />

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
              {showMintMarkers &&
                mints?.map((mint) => {
                  const isHighlighted = highlightedMint?.name === mint.name

                  return (
                    <Marker
                      key={`mint-${mint.name}`}
                      position={[mint.lat, mint.lng]}
                      icon={
                        isHighlighted
                          ? new DivIcon({
                              className: "highlighted-mint-marker",
                              html: `<div class="mint-pin-wrapper" data-mint="${mint.name}">${createHighlightedMintHtml(mint.name)}</div>`,
                              iconSize: [120, 60], // Larger to accommodate label
                              iconAnchor: [60, 12], // Anchor at the center of the circle (24px circle, so 12px from top)
                            })
                          : new DivIcon({
                              className: "mint-marker",
                              html: `<div style="${MAP_STYLES.mintMarker.css}" data-mint="${mint.name}"></div>`,
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
                              title: mint.name,
                              subtitle: isHighlighted
                                ? "This coin was struck here"
                                : "",
                              description: mint.flavour_text ?? "",
                              className: isHighlighted
                                ? "text-purple-900"
                                : "text-blue-800",
                            },
                          })
                        },
                      }}
                    />
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
                      position={[item.lat, item.lng]}
                      zIndexOffset={800}
                      icon={
                        new DivIcon({
                          className: "custom-map-cluster-marker",
                          html: createClusterMarkerHtml(item.count),
                          iconSize: item.count >= 10 ? [42, 42] : [38, 38],
                          iconAnchor: item.count >= 10 ? [21, 21] : [19, 19],
                        })
                      }
                      eventHandlers={{
                        click: (e: L.LeafletMouseEvent) =>
                          handleClusterClick(item, e),
                      }}
                    />
                  )
                }

                const marker = item.marker

                return (
                  <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    zIndexOffset={
                      marker.zIndexOffset ?? (marker.isActive ? 1000 : 0)
                    }
                    icon={
                      new DivIcon({
                        className: "custom-map-marker",
                        html: createReverseTeardropMarkerHtml({
                          fillColor: marker.fillColor,
                          borderColor: marker.borderColor,
                          iconSrc: marker.iconSrc,
                          active: marker.isActive,
                          sizeScale: marker.sizeScale,
                        }),
                        iconSize: marker.isActive
                          ? [
                              Math.round(34 * (marker.sizeScale ?? 1)),
                              Math.round(44 * (marker.sizeScale ?? 1)),
                            ]
                          : [
                              Math.round(30 * (marker.sizeScale ?? 1)),
                              Math.round(40 * (marker.sizeScale ?? 1)),
                            ],
                        iconAnchor: marker.isActive
                          ? [
                              Math.round(17 * (marker.sizeScale ?? 1)),
                              Math.round(42 * (marker.sizeScale ?? 1)),
                            ]
                          : [
                              Math.round(15 * (marker.sizeScale ?? 1)),
                              Math.round(38 * (marker.sizeScale ?? 1)),
                            ],
                      })
                    }
                    eventHandlers={{
                      click: (e: L.LeafletMouseEvent) =>
                        handleCustomMarkerClick(marker, e),
                    }}
                  />
                )
              })}

              {spiderfiedCluster?.markers.map((item) => (
                <Polyline
                  key={`spider-leg-${item.marker.id}`}
                  positions={item.leg}
                  pathOptions={{
                    color: "rgba(15, 23, 42, 0.55)",
                    weight: 2,
                    opacity: 0.9,
                  }}
                />
              ))}

              {spiderfiedCluster?.markers.map((item) => {
                const marker = item.marker

                return (
                  <Marker
                    key={`spiderfied-${marker.id}`}
                    position={item.position}
                    zIndexOffset={1200 + (marker.zIndexOffset ?? 0)}
                    icon={
                      new DivIcon({
                        className: "custom-map-marker spiderfied-map-marker",
                        html: createReverseTeardropMarkerHtml({
                          fillColor: marker.fillColor,
                          borderColor: marker.borderColor,
                          iconSrc: marker.iconSrc,
                          active: true,
                          sizeScale: marker.sizeScale,
                        }),
                        iconSize: [
                          Math.round(34 * (marker.sizeScale ?? 1)),
                          Math.round(44 * (marker.sizeScale ?? 1)),
                        ],
                        iconAnchor: [
                          Math.round(17 * (marker.sizeScale ?? 1)),
                          Math.round(42 * (marker.sizeScale ?? 1)),
                        ],
                      })
                    }
                    eventHandlers={{
                      click: (e: L.LeafletMouseEvent) =>
                        handleCustomMarkerClick(marker, e),
                    }}
                  />
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
                    position={[
                      timelineEventMarker.lat,
                      timelineEventMarker.lng,
                    ]}
                    icon={
                      new DivIcon({
                        className: "timeline-event-marker",
                        html: `
                        <div class="timeline-event-marker-container">
                          <div class="timeline-event-label">${timelineEventMarker.name} (${formatYear(timelineEventMarker.year)})</div>
                          <div class="timeline-event-circle"></div>
                          <div class="timeline-event-tail"></div>
                        </div>
                      `,
                        iconSize: [120, 60], // Width 120px, height 60px (label + circle + tail)
                        iconAnchor: [60, 48], // Anchor at bottom center of tail
                      })
                    }
                    eventHandlers={{
                      click: (e: L.LeafletMouseEvent) =>
                        openPopupFromMouseEvent(e, {
                          title: "",
                          description:
                            timelineEventMarker.description ??
                            "Timeline Event Location",
                          className: "text-center",
                        }),
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
