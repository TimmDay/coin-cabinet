"use client"

import "maplibre-gl/dist/maplibre-gl.css"
import type { Map as MapLibreMap } from "maplibre-gl"
import { setWorkerUrl } from "maplibre-gl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Layer, Map as MapGL, Marker, Source } from "react-map-gl/maplibre"
import type { MapRef } from "react-map-gl/maplibre"
import { useMints } from "~/api/mints"
import { usePlaces } from "~/api/places"
import { MAP_HEIGHT } from "~/lib/constants"
import { formatYear } from "~/lib/utils/date-formatting"
import { parseLatLng, parseZoom, ROME } from "./coordinates"
import { useJurisdictionCorpus, useMapConfiguration } from "./hooks"
import { type Role, type Tier } from "./jurisdictions"
import { mapAtYear } from "./mapAtYear"
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
   * The year whose Jurisdictions to draw, in place of the always-on province
   * layer. On the year slider (`slider`) the page owns the Tier, and an empty
   * Tier stays empty as a fact about that year. On a coin's map (`coin`) the
   * map offers its own Tier control and names the year top left, since it is
   * not otherwise on screen; and when `tier` is empty at that year it draws a
   * Tier with data instead, since the opening Tier is chosen without knowing
   * the year. The caller keeps `tier`, so maps of one coin stay in step.
   */
  yearView?: YearView
  /**
   * Which non-Roman Roles to draw alongside Rome. Empty by default: the map
   * is about the Roman world, and the rest is opt-in context.
   */
  outsiderRoles?: Role[]
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

export type YearView =
  | { kind: "slider"; year: number; tier: Tier }
  | {
      kind: "coin"
      year: number
      tier: Tier
      /** Shows the Realms / Admin areas toggle. Left off where the map cannot be used yet (the phone preview). */
      onTierChange?: (tier: Tier) => void
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
  yearView,
  outsiderRoles = NO_OUTSIDERS,
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

  // Primitives, so an inline `yearView` object does not redo the memo below
  const selectedYear = yearView?.year
  const ownsTier = yearView?.kind === "coin"
  const tier = yearView?.tier
  const onTierChange =
    yearView?.kind === "coin" ? (yearView.onTierChange ?? null) : null
  const showsYear = selectedYear !== undefined

  const corpus = useJurisdictionCorpus(showsYear)

  const atYear = useMemo(
    () =>
      corpus && selectedYear !== undefined
        ? mapAtYear(corpus, {
            year: selectedYear,
            tier,
            fallback: ownsTier,
            outsiderRoles,
            selectedProvinces,
          })
        : null,
    [corpus, selectedYear, ownsTier, tier, outsiderRoles, selectedProvinces],
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
  const jurisdictionLabels = atYear?.labels ?? []
  const jurisdictionsGeoJSON = atYear?.features ?? null

  // Framing is the visitor's business: the camera never moves on its own as
  // the year changes, so this is the escape hatch when they've panned away.
  const bounds = atYear?.bounds
  const fitExtent = useCallback(() => {
    if (!bounds) return
    mapRef.current?.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      { padding: 40, duration: 600 },
    )
  }, [bounds])

  useEffect(() => {
    onFitExtent?.(fitExtent)
  }, [onFitExtent, fitExtent])

  // Nothing on the map canvas is clickable. Jurisdiction fills used to be,
  // but they cover the whole map, so a click meant for a mint or city pin
  // near a border opened a Jurisdiction popup instead. Pins are HTML markers
  // and handle their own clicks.
  const interactiveLayerIds = useMemo<string[]>(() => [], [])

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
                >
                  <MapPin
                    label={`${place.name}, ${place.kind}`}
                    onActivate={(point) =>
                      openPopup(point.clientX, point.clientY, {
                        title: place.name,
                        subtitle: place.kind === "city" ? "City" : place.kind,
                        description: place.flavour_text ?? "",
                        className: "text-map-label",
                      })
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
                  </MapPin>
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

            {ownsTier && selectedYear !== undefined && (
              <div className="group absolute top-3 left-3 z-10">
                <span
                  tabIndex={0}
                  aria-describedby="map-year-tooltip"
                  className="border-line bg-field text-ink font-display focus-visible:ring-moonlight/70 flex h-7 items-center rounded-full border px-3 text-[11px] leading-none tracking-wide uppercase shadow-lg focus-visible:ring-2 focus-visible:outline-none"
                >
                  Map of {formatYear(selectedYear)}
                </span>
                <span
                  id="map-year-tooltip"
                  role="tooltip"
                  className="border-line bg-field text-ink pointer-events-none absolute top-full left-0 mt-1.5 rounded-md border px-2.5 py-1 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                >
                  The year this coin was minted
                </span>
              </div>
            )}

            {/* Sits over the map, bottom left, for pages with no panel. */}
            {onTierChange && atYear?.tier && (
              <TierControl
                value={atYear.tier}
                onChange={onTierChange}
                available={atYear.availableTiers}
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
