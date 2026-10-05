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
import { ROMAN_PROVINCES } from "./constants/provinces"
import { parseLatLng, parseZoom, ROME } from "./coordinates"
import {
  useGeoJsonLayers,
  useJurisdictionCorpus,
  useMapConfiguration,
} from "./hooks"
import type { GeoJsonLayerSpec } from "./hooks"
import { boundsOf, resolveAtYear, type Tier } from "./jurisdictions"
import {
  MAP_BOUNDS_LNGLAT,
  MAP_PAN_BOUNDS_LNGLAT,
  MAP_STYLE_URL,
  MAP_STYLES,
  provinceStyle,
  PROVINCE_LABEL_STYLES,
  createEmpireLayerConfig,
  fadeOutWithZoom,
  OVERLAY_FADE_ZOOM,
} from "./mapConfig"
import { applyOldPaperTheme } from "./mapTheme"
import { markerPopup, type CustomMapMarker } from "./mapMarkers"
import { CustomMarkerLayer, type ClickPoint } from "./CustomMarkerLayer"
import { MapPopup } from "./MapPopup"
import type { ViewportBounds } from "./useMarkerClusters"
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

type PopupContent = {
  title: string
  subtitle?: string
  description?: string
  className?: string
}

function sanitizeCssDimension(value: string, fallback: string): string {
  return /^[0-9a-zA-Z.%(),\s-]+$/.test(value) ? value : fallback
}

// Start with the attribution ("i" button: OpenFreeMap, OpenStreetMap,
// MapLibre) closed. MapLibre's compact attribution control opens itself
// when it is added and only closes on the first drag, with no option to
// start closed, so do what that drag handler does: drop the "show" class.
// The credit stays one click away on the button. The control keeps its
// "maplibregl-compact" class, so a later resize will not reopen it.
function collapseAttribution(map: MapLibreMap) {
  map
    .getContainer()
    .querySelector(".maplibregl-ctrl-attrib")
    ?.classList.remove("maplibregl-compact-show")
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
  /** Height from the lg breakpoint up; defaults to `height` */
  desktopHeight?: string
  /** Width of the map container */
  width?: string
  /** Additional CSS class names */
  className?: string
  /** 'fullscreen' makes the map fill its parent's height */
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
  /**
   * The year to draw. When set, the map shows the Jurisdictions of that year
   * instead of the always-on province layer.
   */
  selectedYear?: number
  /** Which Tier to draw at the Selected year; all Tiers when omitted. */
  tier?: Tier
  /** Receives a function that fits the view to what is currently drawn. */
  onFitExtent?: (fit: () => void) => void
  /** Provinces to draw; all of them by default */
  selectedProvinces?: string[]
  /** Show province labels */
  showProvinceLabels?: boolean
  /** Mint name to highlight with special pin (case insensitive match) */
  highlightMint?: string
  /** Whether default mint markers from the mints table should be displayed */
  showMintMarkers?: boolean
  /** Custom markers to render for coin detail pages and other specialized views */
  customMarkers?: CustomMapMarker[]
  /** Callback to receive the navigate function */
  onNavigate?: (
    navigateFn: (center: [number, number], zoom: number) => void,
  ) => void
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  height = MAP_HEIGHT,
  desktopHeight,
  width = "100%",
  className = "",
  layout = "default",
  showBC60 = false,
  showAD14 = false,
  showAD69 = false,
  showAD117 = false,
  showAD200 = false,
  selectedYear,
  tier,
  onFitExtent,
  selectedProvinces = ROMAN_PROVINCES,
  showProvinceLabels = true,
  highlightMint,
  showMintMarkers = true,
  customMarkers = [],
  onNavigate,
}) => {
  // A bad center or zoom would hand MapLibre NaN, so fall back to the defaults
  const safeCenter = useMemo(
    () => (center ? (parseLatLng(center[0], center[1]) ?? ROME) : ROME),
    [center],
  )
  const safeZoom = parseZoom(zoom, 5)

  // Use custom hooks for configuration and data management
  const config = useMapConfiguration()
  const { data: mints } = useMints()

  const provinces = useMemo(() => provinceStyle(), [])

  const mapRef = useRef<MapRef>(null)
  // Once the visitor zooms, an event or pin selection pans without changing it
  const userHasZoomed = useRef(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  const [currentZoom, setCurrentZoom] = useState<number>(safeZoom)
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
    (marker: CustomMapMarker, point: ClickPoint) => {
      marker.onClick?.()

      const popup = markerPopup(marker)
      if (popup) openPopup(point.clientX, point.clientY, popup)
    },
    [openPopup],
  )

  // Empire extent layer configuration
  const empireLayerConfig = useMemo(
    () =>
      createEmpireLayerConfig(
        showBC60,
        showAD14,
        showAD69,
        showAD117,
        showAD200,
      ),
    [showBC60, showAD14, showAD69, showAD117, showAD200],
  )

  // Every GeoJSON file the map wants, declared in one place. The empire
  // extents stay lazy: their specs are only enabled once their toggle is on.
  const layerSpecs = useMemo<GeoJsonLayerSpec[]>(
    () => [
      { key: "provinces", path: "/data/provinces.geojson" },
      { key: "provinceLabels", path: "/data/provinces_label.geojson" },
      ...Object.entries(empireLayerConfig).map(([key, layerConfig]) => ({
        key,
        path: `/data/${layerConfig.filename}`,
        enabled: layerConfig.showProp === true,
      })),
    ],
    [empireLayerConfig],
  )

  const { layers } = useGeoJsonLayers(layerSpecs)

  // The year-resolved layer and the legacy always-on province layer are two
  // answers to the same question, so a map showing a year hides the old one.
  const showsYear = selectedYear !== undefined
  const provincesData = showsYear ? null : layers.provinces
  const provincesLabelsData = showsYear ? null : layers.provinceLabels

  const corpus = useJurisdictionCorpus(showsYear)

  const resolution = useMemo(
    () =>
      corpus && selectedYear !== undefined
        ? resolveAtYear(corpus, selectedYear, tier)
        : null,
    [corpus, selectedYear, tier],
  )

  const jurisdictionsGeoJSON = useMemo<GeoJSON.FeatureCollection | null>(() => {
    if (!resolution || resolution.jurisdictions.length === 0) return null
    return {
      type: "FeatureCollection",
      features: resolution.jurisdictions.map((j) => j.feature),
    }
  }, [resolution])

  // Framing is the visitor's business: the camera never moves on its own as
  // the year changes, so this is the escape hatch when they've panned away.
  const fitExtent = useCallback(() => {
    const bounds = resolution ? boundsOf(resolution.jurisdictions) : null
    if (!bounds) return
    mapRef.current?.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      { padding: 40, duration: 600 },
    )
  }, [resolution])

  useEffect(() => {
    onFitExtent?.(fitExtent)
  }, [onFitExtent, fitExtent])

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

  // Layer ids currently eligible for click interaction -- must match
  // whichever fill layers are actually mounted below, or MapLibre has
  // nothing to hit-test against.
  const interactiveLayerIds = useMemo(() => {
    const ids: string[] = []
    if (jurisdictionsGeoJSON) {
      ids.push("jurisdictions-fill")
    }
    if (filteredProvincesGeoJSON) {
      ids.push("provinces-fill")
    }
    for (const key of Object.keys(empireLayerConfig)) {
      if (layers[key]) {
        ids.push(`${key}-fill`)
      }
    }
    return ids
  }, [
    jurisdictionsGeoJSON,
    filteredProvincesGeoJSON,
    empireLayerConfig,
    layers,
  ])

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
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
          className: "text-map-label",
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

          const position = parseLatLng(center[0], center[1])
          const numZoom = parseZoom(zoom, 0)

          if (!position || numZoom <= 0) return
          const [numLat, numLng] = position

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

          const targetZoom = userHasZoomed.current ? map.getZoom() : numZoom

          try {
            if (hasValidCurrentCenter && hasValidSize) {
              map.flyTo({
                center: [numLng, numLat],
                zoom: targetZoom,
                duration: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? 0
                  : 1500,
              })
            } else {
              map.jumpTo({ center: [numLng, numLat], zoom: targetZoom })
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
  const safeDesktopHeight = desktopHeight
    ? sanitizeCssDimension(desktopHeight, safeHeight)
    : null

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
      `}</style>
      <div
        className={
          layout === "fullscreen"
            ? `flex h-full flex-col gap-4 ${className}`
            : `space-y-4 ${className}`
        }
      >
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
                : `map-shell-sized relative ${width === "100%" ? "w-full" : ""} ${safeDesktopHeight ? "lg:h-(--map-desktop-height)!" : ""}`
            }
            style={
              safeDesktopHeight
                ? ({
                    "--map-desktop-height": safeDesktopHeight,
                  } as React.CSSProperties)
                : undefined
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
              maxBounds={MAP_PAN_BOUNDS_LNGLAT}
              minZoom={config.minZoom}
              maxZoom={config.maxZoom}
              keyboard={false}
              interactiveLayerIds={interactiveLayerIds}
              onLoad={(e) => {
                setMapLoaded(true)
                updateViewportBounds(e.target)
                hideModernPlaceLabels(e.target)
                applyOldPaperTheme(e.target)
                collapseAttribution(e.target)
              }}
              onZoomEnd={(e) => {
                // Only a visitor's own zoom (wheel, pinch, double click) carries
                // the original event; flyTo does not
                if (e.originalEvent) userHasZoomed.current = true
                setCurrentZoom(e.viewState.zoom)
                updateViewportBounds(e.target)
              }}
              onMoveEnd={(e) => updateViewportBounds(e.target)}
              onMoveStart={() => {
                setCustomPopup((prev) => ({ ...prev, isVisible: false }))
              }}
              onClick={handleMapClick}
            >
              {/* Empire extent layers */}
              {Object.entries(empireLayerConfig).map(([key, layerConfig]) => {
                const data = layers[key]
                if (!data) return null

                return (
                  <Source key={key} id={key} type="geojson" data={data}>
                    <Layer
                      id={`${key}-fill`}
                      type="fill"
                      maxzoom={OVERLAY_FADE_ZOOM.to}
                      paint={{
                        "fill-color": layerConfig.style.fillColor,
                        "fill-opacity": fadeOutWithZoom(
                          layerConfig.style.fillOpacity,
                        ),
                      }}
                    />
                    <Layer
                      id={`${key}-line`}
                      type="line"
                      maxzoom={OVERLAY_FADE_ZOOM.to}
                      paint={{
                        "line-color": layerConfig.style.lineColor,
                        "line-width": layerConfig.style.lineWidth,
                        "line-opacity": fadeOutWithZoom(
                          layerConfig.style.lineOpacity,
                        ),
                        "line-dasharray": layerConfig.style.lineDasharray,
                      }}
                    />
                  </Source>
                )
              })}

              {/* Jurisdictions at the Selected year */}
              {jurisdictionsGeoJSON && (
                <Source
                  id="jurisdictions"
                  type="geojson"
                  data={jurisdictionsGeoJSON}
                >
                  <Layer
                    id="jurisdictions-fill"
                    type="fill"
                    maxzoom={OVERLAY_FADE_ZOOM.to}
                    paint={{
                      "fill-color": provinces.fillColor,
                      "fill-opacity": fadeOutWithZoom(provinces.fillOpacity),
                    }}
                  />
                  <Layer
                    id="jurisdictions-line"
                    type="line"
                    maxzoom={OVERLAY_FADE_ZOOM.to}
                    paint={{
                      "line-color": provinces.lineColor,
                      "line-width": provinces.lineWidth,
                      "line-opacity": fadeOutWithZoom(provinces.lineOpacity),
                    }}
                  />
                </Source>
              )}

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
                    maxzoom={OVERLAY_FADE_ZOOM.to}
                    paint={{
                      "fill-color": provinces.fillColor,
                      "fill-opacity": fadeOutWithZoom(provinces.fillOpacity),
                    }}
                  />
                  <Layer
                    id="provinces-line"
                    type="line"
                    maxzoom={OVERLAY_FADE_ZOOM.to}
                    paint={{
                      "line-color": provinces.lineColor,
                      "line-width": provinces.lineWidth,
                      "line-opacity": fadeOutWithZoom(provinces.lineOpacity),
                      "line-dasharray": provinces.lineDasharray,
                    }}
                  />
                </Source>
              )}

              {/* Province Labels */}
              {showProvinceLabels &&
                currentZoom > PROVINCE_LABEL_STYLES.minZoomLevel &&
                currentZoom < OVERLAY_FADE_ZOOM.to &&
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
                              ? "text-pin-wine"
                              : "text-map-label",
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

              <CustomMarkerLayer
                markers={customMarkers}
                zoom={currentZoom}
                bounds={viewportBounds}
                onMarkerClick={handleCustomMarkerClick}
              />
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
