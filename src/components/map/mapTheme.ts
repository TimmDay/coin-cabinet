import type {
  FilterSpecification,
  LayerSpecification,
  Map as MapLibreMap,
} from "maplibre-gl"
import { glColor, type MapColor } from "./mapColors"
import { fadeInWithZoom, MODERN_DETAIL_ZOOM } from "./mapConfig"

// "Old paper at sunset": warm parchment land, dusty rose water, terracotta
// borders. Applied on top of OpenFreeMap's dark style once it has loaded, so
// the tiles and layer ids stay the vendor's and only the paint changes. The
// colours are the `--color-map-*` tokens in globals.css.

// Airports are clutter on a map of the ancient world. Matched by source-layer
// so new vendor layers in this group are hidden too.
const HIDDEN_SOURCE_LAYERS = new Set(["aeroway"])

// Zoomed right in, the modern city shows through: roads, rail, buildings and
// street names. Each is held back until the overlay starts to fade (see
// MODERN_DETAIL_ZOOM) so the regional map stays free of it.
const MODERN_SOURCE_LAYERS = new Set([
  "transportation",
  "transportation_name",
  "building",
])

// One-way arrows are a sprite icon, not worth keeping.
const HIDDEN_MODERN_LAYERS = new Set(["road_oneway", "road_oneway_opposite"])

// Landmarks worth a pin on modern Rome: the sights, not the shops.
const LANDMARK_CLASSES = ["attraction", "monument", "museum", "castle"]

const FILL_BY_ID: Record<string, MapColor> = {
  background: "map-land",
  water: "map-water",
  landcover_ice_shelf: "map-ice",
  landcover_glacier: "map-ice",
  landuse_residential: "map-town",
  landcover_wood: "map-woods",
  landuse_park: "map-woods",
}

/** Paints one modern layer in the parchment palette and fades it in with zoom. */
function paintModernLayer(map: MapLibreMap, layer: LayerSpecification) {
  map.setLayerZoomRange(layer.id, MODERN_DETAIL_ZOOM.from, 24)

  switch (layer.type) {
    case "fill":
      map.setPaintProperty(layer.id, "fill-color", glColor("map-building"))
      map.setPaintProperty(
        layer.id,
        "fill-outline-color",
        glColor("map-road-casing"),
      )
      map.setPaintProperty(layer.id, "fill-opacity", fadeInWithZoom())
      break
    case "line": {
      const color = layer.id.includes("casing") ? "map-road-casing" : "map-road"
      map.setPaintProperty(layer.id, "line-color", glColor(color))
      map.setPaintProperty(layer.id, "line-opacity", fadeInWithZoom())
      break
    }
    case "symbol":
      map.setPaintProperty(layer.id, "text-color", glColor("map-ink"))
      map.setPaintProperty(
        layer.id,
        "text-halo-color",
        glColor("map-street-label-halo"),
      )
      map.setPaintProperty(layer.id, "text-opacity", fadeInWithZoom())
      break
  }
}

/**
 * Names and dots for the modern sights, drawn from the tiles' `poi` layer
 * (the style does not draw it). Added last so they sit above the roads.
 */
function addLandmarks(map: MapLibreMap, textFont: string[]) {
  const source = "openmaptiles"
  const filter: FilterSpecification = [
    "all",
    ["in", ["get", "class"], ["literal", LANDMARK_CLASSES]],
    ["!=", ["get", "subclass"], "viewpoint"],
    ["has", "name"],
  ]
  const common = {
    source,
    "source-layer": "poi",
    minzoom: MODERN_DETAIL_ZOOM.from,
    filter,
  }

  map.addLayer({
    ...common,
    id: "landmark-dot",
    type: "circle",
    paint: {
      "circle-radius": 3.5,
      "circle-color": glColor("map-landmark"),
      "circle-stroke-color": glColor("map-street-label-halo"),
      "circle-stroke-width": 1,
      "circle-opacity": fadeInWithZoom(),
      "circle-stroke-opacity": fadeInWithZoom(),
    },
  })
  map.addLayer({
    ...common,
    id: "landmark-label",
    type: "symbol",
    layout: {
      "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
      "text-font": textFont,
      "text-size": 11,
      "text-anchor": "top",
      "text-offset": [0, 0.6],
      "text-max-width": 8,
      // Most important first, so a crowded block keeps its best-known names
      "symbol-sort-key": ["get", "rank"],
    },
    paint: {
      "text-color": glColor("map-landmark"),
      "text-halo-color": glColor("map-street-label-halo"),
      "text-halo-width": 1.2,
      "text-opacity": fadeInWithZoom(),
    },
  })
}

export function applyOldPaperTheme(map: MapLibreMap) {
  const layers = map.getStyle().layers
  let streetFont: string[] = ["Noto Sans Regular"]

  for (const layer of layers) {
    const sourceLayer =
      "source-layer" in layer ? (layer["source-layer"] as string) : ""

    if (HIDDEN_MODERN_LAYERS.has(layer.id)) {
      map.setLayoutProperty(layer.id, "visibility", "none")
      continue
    }

    if (MODERN_SOURCE_LAYERS.has(sourceLayer)) {
      paintModernLayer(map, layer)
      const font = layer.type === "symbol" && layer.layout?.["text-font"]
      if (Array.isArray(font)) streetFont = font as string[]
      continue
    }

    if (
      HIDDEN_SOURCE_LAYERS.has(sourceLayer) ||
      layer.id === "boundary_state"
    ) {
      map.setLayoutProperty(layer.id, "visibility", "none")
      continue
    }

    const fill = FILL_BY_ID[layer.id]
    if (fill) {
      map.setPaintProperty(
        layer.id,
        layer.type === "background" ? "background-color" : "fill-color",
        glColor(fill),
      )
    } else if (layer.id === "waterway") {
      map.setPaintProperty(layer.id, "line-color", glColor("map-waterway"))
    } else if (layer.id === "water_name") {
      map.setPaintProperty(layer.id, "text-color", glColor("map-water-label"))
      map.setPaintProperty(
        layer.id,
        "text-halo-color",
        glColor("map-water-label-halo"),
      )
    } else if (sourceLayer === "boundary") {
      map.setPaintProperty(layer.id, "line-color", glColor("map-border"))
      map.setPaintProperty(layer.id, "line-opacity", 0.45)
    }
  }

  addLandmarks(map, streetFont)
}
