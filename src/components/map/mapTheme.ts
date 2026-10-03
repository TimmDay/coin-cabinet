import type { Map as MapLibreMap } from "maplibre-gl"

// "Old paper at sunset": warm parchment land, dusty rose water, terracotta
// borders. Applied on top of OpenFreeMap's dark style once it has loaded, so
// the tiles and layer ids stay the vendor's and only the paint changes.
export const OLD_PAPER = {
  paper: "#948060",
  woodland: "#887555",
  residential: "#8d7a5a",
  ice: "#a39578",
  water: "#6b5860",
  waterway: "#5f4e55",
  waterLabel: "#d9c4cc",
  waterLabelHalo: "#5a474e",
  border: "#a8604a",
} as const

// Roads, rail, buildings and airports are modern clutter on a map of the
// ancient world. Matched by source-layer so new vendor layers in these groups
// are hidden too.
const HIDDEN_SOURCE_LAYERS = new Set([
  "transportation",
  "transportation_name",
  "building",
  "aeroway",
])

const FILL_BY_ID: Record<string, string> = {
  background: OLD_PAPER.paper,
  water: OLD_PAPER.water,
  landcover_ice_shelf: OLD_PAPER.ice,
  landcover_glacier: OLD_PAPER.ice,
  landuse_residential: OLD_PAPER.residential,
  landcover_wood: OLD_PAPER.woodland,
  landuse_park: OLD_PAPER.woodland,
}

export function applyOldPaperTheme(map: MapLibreMap) {
  for (const layer of map.getStyle().layers) {
    const sourceLayer =
      "source-layer" in layer ? (layer["source-layer"] as string) : ""

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
        fill,
      )
    } else if (layer.id === "waterway") {
      map.setPaintProperty(layer.id, "line-color", OLD_PAPER.waterway)
    } else if (layer.id === "water_name") {
      map.setPaintProperty(layer.id, "text-color", OLD_PAPER.waterLabel)
      map.setPaintProperty(
        layer.id,
        "text-halo-color",
        OLD_PAPER.waterLabelHalo,
      )
    } else if (sourceLayer === "boundary") {
      map.setPaintProperty(layer.id, "line-color", OLD_PAPER.border)
      map.setPaintProperty(layer.id, "line-opacity", 0.45)
    }
  }
}
