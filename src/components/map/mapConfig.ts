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
  onChange?: (show: boolean) => void
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
  onBC60Change?: (show: boolean) => void,
  showAD14?: boolean,
  onAD14Change?: (show: boolean) => void,
  showAD69?: boolean,
  onAD69Change?: (show: boolean) => void,
  showAD117?: boolean,
  onAD117Change?: (show: boolean) => void,
  showAD200?: boolean,
  onAD200Change?: (show: boolean) => void,
): EmpireLayerConfigMap => ({
  bc60: {
    id: "bc60",
    name: "BC 60",
    title: "Roman Republic BC 60",
    filename: "roman_empire_bc_60_extent.geojson",
    description:
      "Roman Republic around 60 BCE, during the First Triumvirate (Caesar, Pompey, Crassus)",
    showProp: showBC60,
    onChange: onBC60Change,
    style: {
      fillColor: "#DEB887",
      fillOpacity: 0.15,
      lineColor: "#8B4513",
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
    onChange: onAD14Change,
    style: {
      fillColor: "#87CEEB",
      fillOpacity: 0.15,
      lineColor: "#4169E1",
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
    onChange: onAD69Change,
    style: {
      fillColor: "#FFB6C1",
      fillOpacity: 0.15,
      lineColor: "#DC143C",
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
    onChange: onAD117Change,
    style: {
      fillColor: "#90EE90",
      fillOpacity: 0.15,
      lineColor: "#228B22",
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
    onChange: onAD200Change,
    style: {
      fillColor: "#FFE4B5",
      fillOpacity: 0.15,
      lineColor: "#FF8C00",
      lineWidth: 2,
      lineOpacity: 0.8,
      lineDasharray: [2, 7],
    },
  },
})

// Map styling configurations
export const MAP_STYLES = {
  // Province boundaries style
  provinces: {
    fillColor: "#8b5cf6", // Purple fill
    fillOpacity: 0.2,
    lineColor: "#7c3aed", // Purple border
    lineWidth: 2,
    lineOpacity: 0.8,
    lineDasharray: [5, 5] as [number, number],
  } satisfies EmpireLayerStyle,

  // Mint marker style (plain dot, not the highlighted teardrop pin)
  mintMarker: {
    style: {
      width: "12px",
      height: "12px",
      backgroundColor: "#a78bfa",
      border: "2px solid hsl(var(--map-label))",
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
    color: "hsl(var(--map-label))",
    textAlign: "center",
    whiteSpace: "pre",
    lineHeight: 1.2,
    width: "max-content",
    pointerEvents: "none",
  },
  minZoomLevel: 4,
} as const
