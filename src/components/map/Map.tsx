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
import { usePlaces } from "~/api/places"
import { MAP_HEIGHT } from "~/lib/constants"
import { parseLatLng, parseZoom, ROME } from "./coordinates"
import { useJurisdictionCorpus, useMapConfiguration } from "./hooks"
import {
  boundsOf,
  formatYear,
  labelPointOf,
  resolveAtYear,
  type Role,
  type Tier,
} from "./jurisdictions"
import {
  MAP_BOUNDS_LNGLAT,
  MAP_PAN_BOUNDS_LNGLAT,
  MAP_STYLE_URL,
  MAP_STYLES,
  provinceStyle,
  PROVINCE_LABEL_STYLES,
  fadeOutWithZoom,
  OVERLAY_FADE_ZOOM,
  jurisdictionColourExpression,
  jurisdictionFillOpacity,
  REALM_LABEL_STYLES,
} from "./mapConfig"
import { applyOldPaperTheme } from "./mapTheme"
import { markerPopup, type CustomMapMarker } from "./mapMarkers"
import { CustomMarkerLayer, type ClickPoint } from "./CustomMarkerLayer"
import { MapPin } from "./MapPin"
import { MapPopup } from "./MapPopup"
import { TierControl } from "./TierControl"
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
  /**
   * The year to draw. When set, the map shows the Jurisdictions of that year
   * instead of the always-on province layer.
   */
  selectedYear?: number
  /** Which Tier to draw at the Selected year; all Tiers when omitted. */
  tier?: Tier
  /**
   * Which non-Roman Roles to draw alongside Rome. Empty by default: the map
   * is about the Roman world, and the rest is opt-in context.
   */
  outsiderRoles?: Role[]
  /**
   * Lets the visitor change Tier from a small control over the map itself.
   * Supplied by pages with no room for a control panel; omitted leaves the
   * Tier fixed by the `tier` prop.
   */
  onTierChange?: (tier: Tier) => void
  /**
   * Open framed on these bounds, [west, south, east, north], instead of a
   * centre and zoom. Fits whatever the viewport is, so the same ground is on
   * screen on a phone and a desktop.
   */
  initialBounds?: [number, number, number, number]
  /** Receives a function that fits the view to what is currently drawn. */
  onFitExtent?: (fit: () => void) => void
  /**
   * Provinces to draw. Omitted means all of them: the Jurisdiction layer must
   * not be filtered against a list that predates it, or names it does not
   * recognise (the regiones, Alpes Graiae) would silently vanish.
   */
  selectedProvinces?: string[]
  /** Show province labels */
  showProvinceLabels?: boolean
  /** Mint name to highlight with special pin (case insensitive match) */
  highlightMint?: string
  /** Whether default mint markers from the mints table should be displayed */
  showMintMarkers?: boolean
  /** Show places of kind "city" from the places table. */
  showCityMarkers?: boolean
  /** Show every place in the places table, cities included. */
  showPlaceMarkers?: boolean
  /** Custom markers to render for coin detail pages and other specialized views */
  customMarkers?: CustomMapMarker[]
  /** Callback to receive the navigate function */
  onNavigate?: (
    navigateFn: (center: [number, number], zoom: number) => void,
  ) => void
}

/** Stable empty default, so the memo below is not invalidated every render. */
const NO_OUTSIDERS: Role[] = []

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  height = MAP_HEIGHT,
  desktopHeight,
  width = "100%",
  className = "",
  layout = "default",
  selectedYear,
  tier,
  outsiderRoles = NO_OUTSIDERS,
  onTierChange,
  initialBounds,
  onFitExtent,
  selectedProvinces,
  showProvinceLabels = true,
  highlightMint,
  showMintMarkers = true,
  showCityMarkers = false,
  showPlaceMarkers = false,
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
  // Only fetched once something asks for them.
  const { data: places } = usePlaces({
    enabled: showCityMarkers || showPlaceMarkers,
  })

  // "Show POI" is every place, cities included, so the two selections union
  // rather than stacking a second marker on top of each city.
  const placeMarkers = useMemo(() => {
    if (!places) return []
    if (showPlaceMarkers) return places
    if (showCityMarkers) return places.filter((place) => place.kind === "city")
    return []
  }, [places, showCityMarkers, showPlaceMarkers])

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

  const showsYear = selectedYear !== undefined

  const corpus = useJurisdictionCorpus(showsYear)

  const resolution = useMemo(
    () =>
      corpus && selectedYear !== undefined
        ? resolveAtYear(corpus, selectedYear, tier)
        : null,
    [corpus, selectedYear, tier],
  )

  // Built after mount: glColor reads the page's computed styles.
  const jurisdictionColour = useMemo(
    () => (showsYear ? jurisdictionColourExpression() : null),
    [showsYear],
  )

  /**
   * Realm names. Not decoration: the identity palette's CVD separation sits in
   * the band that is only legal alongside secondary encoding, and its contrast
   * over the map's land is under 3:1. The labels are what discharge both.
   */
  const jurisdictionLabels = useMemo(() => {
    if (!resolution) return []
    return resolution.jurisdictions
      .map((j) => {
        const point = labelPointOf(j.feature)
        return point
          ? {
              // An asterisk marks a Jurisdiction whose dates are assumed
              // rather than sourced, so a reader can tell at a glance which
              // of these the map is guessing about.
              name: j.datesAssumed ? `${j.name}*` : j.name,
              tier: j.tier,
              lng: point[0],
              lat: point[1],
            }
          : null
      })
      .filter(
        (
          label,
        ): label is {
          name: string
          tier: Tier
          lng: number
          lat: number
        } => Boolean(label),
      )
  }, [resolution])

  const jurisdictionsGeoJSON = useMemo<GeoJSON.FeatureCollection | null>(() => {
    if (!resolution || resolution.jurisdictions.length === 0) return null
    // Which Jurisdictions to show is a separate axis from which ones existed,
    // so the selection narrows what the year already resolved.
    const features = resolution.jurisdictions
      .filter((j) => j.role === "roman" || outsiderRoles.includes(j.role))
      .filter(
        (j) =>
          !selectedProvinces ||
          j.tier !== "province" ||
          selectedProvinces.includes(j.name),
      )
      // `attested` has to reach MapLibre as a property: a reconstruction is
      // drawn with a broken outline, and dasharray cannot be data-driven, so
      // the two cases are split across two line layers filtered on this.
      .map((j) => ({
        ...j.feature,
        properties: { ...j.feature.properties, attested: j.attested },
      }))
    if (features.length === 0) return null
    return { type: "FeatureCollection", features }
  }, [resolution, selectedProvinces, outsiderRoles])

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

  // Must match whichever fill layers are actually mounted below, or MapLibre
  // has nothing to hit-test against.
  const interactiveLayerIds = useMemo(
    () => (jurisdictionsGeoJSON ? ["jurisdictions-fill"] : []),
    [jurisdictionsGeoJSON],
  )

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature: MapGeoJSONFeature | undefined = e.features?.[0]
      if (!feature?.layer) return

      const layerId = feature.layer.id

      if (layerId !== "jurisdictions-fill") return

      const name = feature.properties?.name as string | undefined
      if (!name) return

      const basisYear = feature.properties?.basisYear as number | undefined
      const attested = feature.properties?.attested as boolean | undefined

      openPopup(e.originalEvent.clientX, e.originalEvent.clientY, {
        title: name,
        description:
          attested === false && typeof basisYear === "number"
            ? `Outline as at ${formatYear(basisYear)}, reconstructed for this year`
            : "Roman territory",
        className: "text-map-label",
      })
    },
    [openPopup],
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
              initialViewState={
                initialBounds
                  ? {
                      bounds: initialBounds,
                      fitBoundsOptions: { padding: 24 },
                    }
                  : {
                      longitude: safeCenter[1],
                      latitude: safeCenter[0],
                      zoom: safeZoom,
                    }
              }
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
                      "fill-color": jurisdictionColour ?? provinces.fillColor,
                      "fill-opacity": fadeOutWithZoom(
                        jurisdictionFillOpacity() as unknown as number,
                      ),
                    }}
                  />
                  <Layer
                    id="jurisdictions-line"
                    type="line"
                    maxzoom={OVERLAY_FADE_ZOOM.to}
                    filter={["==", ["get", "attested"], true]}
                    paint={{
                      "line-color": jurisdictionColour ?? provinces.lineColor,
                      "line-width": 2,
                      "line-opacity": fadeOutWithZoom(0.9),
                    }}
                  />
                  {/* A reconstruction gets a broken outline, so uncertainty is
                      visible without having to read anything. */}
                  <Layer
                    id="jurisdictions-line-inferred"
                    type="line"
                    maxzoom={OVERLAY_FADE_ZOOM.to}
                    filter={["==", ["get", "attested"], false]}
                    paint={{
                      "line-color": jurisdictionColour ?? provinces.lineColor,
                      "line-width": 1.5,
                      "line-opacity": fadeOutWithZoom(0.75),
                      "line-dasharray": [3, 3],
                    }}
                  />
                </Source>
              )}

              {/* Jurisdiction names. For Realms these are the palette's
                  secondary encoding, so they are required rather than optional. */}
              {currentZoom < OVERLAY_FADE_ZOOM.to &&
                jurisdictionLabels
                  .filter(
                    (label) => label.tier === "realm" || showProvinceLabels,
                  )
                  .map((label) => (
                    <Marker
                      key={`jurisdiction-${label.name}`}
                      longitude={label.lng}
                      latitude={label.lat}
                      anchor="center"
                    >
                      <div
                        style={
                          label.tier === "realm"
                            ? REALM_LABEL_STYLES.container
                            : PROVINCE_LABEL_STYLES.container
                        }
                      >
                        {label.name}
                      </div>
                    </Marker>
                  ))}

              {/* Places: cities, or everything, by the visitor's choice */}
              {placeMarkers.map((place) => (
                <Marker
                  key={`place-${place.id}`}
                  longitude={place.lng}
                  latitude={place.lat}
                  anchor="center"
                  onClick={(e) =>
                    openPopup(
                      e.originalEvent.clientX,
                      e.originalEvent.clientY,
                      {
                        title: place.name,
                        subtitle: place.kind === "city" ? "City" : place.kind,
                        description: place.flavour_text ?? "",
                        className: "text-map-label",
                      },
                    )
                  }
                >
                  <div
                    style={
                      place.kind === "city"
                        ? MAP_STYLES.cityMarker.style
                        : MAP_STYLES.placeMarker.style
                    }
                    data-place={place.name}
                  />
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
                    >
                      <MapPin
                        label={
                          isHighlighted
                            ? `${mint.name}, where this coin was struck`
                            : `${mint.name}, mint`
                        }
                        onActivate={(point) =>
                          openPopup(point.clientX, point.clientY, {
                            title: mint.name,
                            subtitle: isHighlighted
                              ? "This coin was struck here"
                              : "",
                            description: mint.flavour_text ?? "",
                            className: isHighlighted
                              ? "text-pin-wine"
                              : "text-map-label",
                          })
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
                      </MapPin>
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

            {/* Sits over the map, bottom left, for pages with no panel. */}
            {onTierChange && tier && (
              <TierControl
                value={tier}
                onChange={onTierChange}
                available={resolution?.availableTiers ?? []}
                className="absolute bottom-3 left-3 z-10 shadow-lg"
              />
            )}
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
