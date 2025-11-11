import type { PathOptions } from "leaflet"

export type EmpireLayerConfig = {
  id: string
  name: string
  title: string
  filename: string
  description: string
  showProp?: boolean
  onChange?: (show: boolean) => void
  color: string
  fillColor: string
  style: PathOptions
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
    description: "Roman Empire at its greatest extent under Trajan in AD 117",
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
})

// Map styling configurations
export const MAP_STYLES = {
  // Historical boundaries style
  boundaries: {
    color: "#8B4513", // Roman brown
    weight: 2,
    opacity: 0.8,
    fillColor: "#DEB887",
    fillOpacity: 0.1,
  },

  // Province boundaries style
  provinces: {
    color: "#7c3aed", // Purple border
    weight: 2,
    opacity: 0.8,
    fillColor: "#8b5cf6", // Purple fill
    fillOpacity: 0.2,
    dashArray: "5, 5",
  },

  // Mint marker style
  mintMarker: {
    css: `
      width: 12px;
      height: 12px;
      background-color: #a78bfa;
      border: 2px solid #6b21a8;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `,
    iconSize: [12, 12] as [number, number],
    iconAnchor: [6, 6] as [number, number],
  },
} as const

// Map bounds configuration
export const MAP_BOUNDS = {
  // Roman Empire bounds with 500km buffer (approximate)
  // Extended from Atlantic to Mesopotamia, from Scotland to Sahara
  maxBounds: [
    [65.0, -15.0] as [number, number], // Northeast: Scotland + buffer, Atlantic + buffer
    [20, 55.0] as [number, number], // Southwest: North Africa + 200km extra south, Iraq + buffer
  ] as [[number, number], [number, number]],
  maxBoundsViscosity: 1.0,
}

// Tile layer configuration
export const TILE_LAYER_CONFIG = {
  // Using CartoDB Dark Matter No Labels for darker, muted styling
  url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  // Custom styling to make it more muted
  opacity: 0.5,
} as const

// Leaflet icon fix for Next.js
export const LEAFLET_ICON_CONFIG = {
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
} as const

// Province label styling
export const PROVINCE_LABEL_STYLES = {
  container: `
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 600;
    color: #6b21a8;
    text-align: center;
    white-space: pre;
    line-height: 1.2;
    width: max-content;
    pointer-events: none;
    transform: translateX(-40%) translateY(-50%);
  `,
  minZoomLevel: 4,
} as const
