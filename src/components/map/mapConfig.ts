import type { ExpressionSpecification } from "maplibre-gl"
import { cssColor, glColor } from "./mapColors"

export type EmpireLayerStyle = {
  fillColor: string
  fillOpacity: number
  lineColor: string
  lineWidth: number
  lineOpacity: number
  lineDasharray: [number, number]
}

export type EmpireLayerConfig = {
  id: string
  name: string
  title: string
  filename: string
  description: string
  showProp?: boolean
  style: EmpireLayerStyle
}

export type EmpireLayerConfigMap = {
  bc60: EmpireLayerConfig
  ad14: EmpireLayerConfig
  ad69: EmpireLayerConfig
  ad117: EmpireLayerConfig
  ad200: EmpireLayerConfig
}

// Empire extent layer configurations
export const createEmpireLayerConfig = (
  showBC60?: boolean,
  showAD14?: boolean,
  showAD69?: boolean,
  showAD117?: boolean,
  showAD200?: boolean,
): EmpireLayerConfigMap => ({
  bc60: {
    id: "bc60",
    name: "BC 60",
    title: "Roman Republic BC 60",
    filename: "roman_empire_bc_60_extent.geojson",
    description:
      "Roman Republic around 60 BCE, during the First Triumvirate (Caesar, Pompey, Crassus)",
    showProp: showBC60,
    style: {
      fillColor: glColor("map-bc60-fill"),
      fillOpacity: 0.15,
      lineColor: glColor("map-bc60-line"),
      lineWidth: 2,
      lineOpacity: 0.8,
      lineDasharray: [6, 3],
    },
  },
  ad14: {
    id: "ad14",
    name: "AD 14",
    title: "Roman Empire AD 14",
    filename: "roman_empire_ad_14_extent.geojson",
    description: "Roman Empire at the death of Augustus in AD 14",
    showProp: showAD14,
    style: {
      fillColor: glColor("map-ad14-fill"),
      fillOpacity: 0.15,
      lineColor: glColor("map-ad14-line"),
      lineWidth: 2,
      lineOpacity: 0.8,
      lineDasharray: [5, 4],
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
    style: {
      fillColor: glColor("map-ad69-fill"),
      fillOpacity: 0.15,
      lineColor: glColor("map-ad69-line"),
      lineWidth: 2,
      lineOpacity: 0.8,
      lineDasharray: [4, 5],
    },
  },
  ad117: {
    id: "ad117",
    name: "AD 117",
    title: "Roman Empire AD 117",
    filename: "roman_empire_ad_117_extent.geojson",
    description: "Roman Empire at its greatest extent under Trajan in AD 117",
    showProp: showAD117,
    style: {
      fillColor: glColor("map-ad117-fill"),
      fillOpacity: 0.15,
      lineColor: glColor("map-ad117-line"),
      lineWidth: 2,
      lineOpacity: 0.8,
      lineDasharray: [3, 6],
    },
  },
  ad200: {
    id: "ad200",
    name: "AD 200",
    title: "Roman Empire AD 200",
    filename: "roman_empire_AD_200_extent.geojson",
    description: "Roman Empire around AD 200, during the Severan dynasty",
    showProp: showAD200,
    style: {
      fillColor: glColor("map-ad200-fill"),
      fillOpacity: 0.15,
      lineColor: glColor("map-ad200-line"),
      lineWidth: 2,
      lineOpacity: 0.8,
      lineDasharray: [2, 7],
    },
  },
})

// Map styling configurations
// Province boundaries style. A function because MapLibre needs the resolved
// colours (see glColor), which only exist in the browser.
export const provinceStyle = (): EmpireLayerStyle => ({
  fillColor: glColor("map-province-fill"),
  fillOpacity: 0.12,
  lineColor: glColor("map-province-line"),
  lineWidth: 2,
  lineOpacity: 0.8,
  lineDasharray: [5, 5],
})

export const MAP_STYLES = {
  // Mint marker style (plain dot, not the highlighted teardrop pin)
  mintMarker: {
    style: {
      width: "12px",
      height: "12px",
      backgroundColor: cssColor("pin-rose"),
      border: `2px solid ${cssColor("pin-cream-warm")}`,
      borderRadius: "9999px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },
  },
} as const

// Map bounds configuration. Kept in [[lat, lng], [lat, lng]] shape (not
// MapLibre's native [lng, lat]) because CoinDeepDive.tsx's
// isWithinMapBounds destructures maxBounds positionally as
// [[maxLat, minLng], [minLat, maxLng]] -- changing this shape would need a
// matching change there too.
export const MAP_BOUNDS = {
  // Roman Empire bounds with 500km buffer (approximate)
  // Extended from Atlantic to Mesopotamia, from Scotland to Sahara
  maxBounds: [
    [65.0, -15.0] as [number, number], // Northeast: Scotland + buffer, Atlantic + buffer
    [20, 55.0] as [number, number], // Southwest: North Africa + 200km extra south, Iraq + buffer
  ] as [[number, number], [number, number]],
}

// MapLibre wants maxBounds as flat [west, south, east, north] -- derived
// once from MAP_BOUNDS.maxBounds above rather than duplicating the values.
export const MAP_BOUNDS_LNGLAT: [number, number, number, number] = [
  MAP_BOUNDS.maxBounds[0][1], // west
  MAP_BOUNDS.maxBounds[1][0], // south
  MAP_BOUNDS.maxBounds[1][1], // east
  MAP_BOUNDS.maxBounds[0][0], // north
]

// How far the map can be panned: the coverage above plus half its width again
// on the west and east sides, and half its height again on the south side, so
// the edges are easy to drag past. Only the
// MapLibre maxBounds use this; coin locations are still filtered against
// MAP_BOUNDS.
const PAN_EXTRA_LNG = (MAP_BOUNDS_LNGLAT[2] - MAP_BOUNDS_LNGLAT[0]) * 0.5
const PAN_EXTRA_LAT = (MAP_BOUNDS_LNGLAT[3] - MAP_BOUNDS_LNGLAT[1]) * 0.5
export const MAP_PAN_BOUNDS_LNGLAT: [number, number, number, number] = [
  MAP_BOUNDS_LNGLAT[0] - PAN_EXTRA_LNG,
  MAP_BOUNDS_LNGLAT[1] - PAN_EXTRA_LAT,
  MAP_BOUNDS_LNGLAT[2] + PAN_EXTRA_LNG,
  MAP_BOUNDS_LNGLAT[3],
]

// Where the deep-dive maps open: as far out as the map allows (its minimum
// zoom, see useMapConfiguration) and centred on the heel of Italy (Santa Maria
// di Leuca), which puts most of the empire in view.
export const DEEP_DIVE_MAP_VIEW = {
  center: [39.8, 18.36] as [number, number],
  zoom: 3,
}

// Zooming in, the modern streets, buildings and landmarks fade in over this
// range (zoom 13 to 14).
export const MODERN_DETAIL_ZOOM = { from: 13, to: 14 } as const

// The ancient overlay (provinces, empire extents) is gone well before the
// basemap starts showing minor waterways (canals at zoom 12, streams at 13).
export const OVERLAY_FADE_ZOOM = { from: 6, to: 7 } as const

/** An opacity that rises from 0 to 1 across the modern detail zoom range. */
export const fadeInWithZoom = (): ExpressionSpecification => [
  "interpolate",
  ["linear"],
  ["zoom"],
  MODERN_DETAIL_ZOOM.from,
  0,
  MODERN_DETAIL_ZOOM.to,
  1,
]

/** An opacity that falls from `opacity` to 0 across the overlay fade range. */
export const fadeOutWithZoom = (opacity: number): ExpressionSpecification => [
  "interpolate",
  ["linear"],
  ["zoom"],
  OVERLAY_FADE_ZOOM.from,
  opacity,
  OVERLAY_FADE_ZOOM.to,
  0,
]

// MapLibre style URL -- OpenFreeMap's "dark" style: free, no API key, no
// usage cap. Replaces the CartoDB raster tiles, which stopped serving
// anonymous requests and now show an "API KEY REQUIRED" watermark instead.
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark"

// Province label styling
export const PROVINCE_LABEL_STYLES = {
  container: {
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "12px",
    fontWeight: 600,
    color: cssColor("map-ink"),
    fontFamily: "var(--font-display)", // The legends' inscriptional capitals
    letterSpacing: "0.06em",
    textAlign: "center",
    whiteSpace: "pre",
    lineHeight: 1.2,
    width: "max-content",
    pointerEvents: "none",
  },
  minZoomLevel: 4,
} as const
