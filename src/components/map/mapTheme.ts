import type { Map as MapLibreMap } from "maplibre-gl"
import { glColor, type MapColor } from "./mapColors"

// "Old paper at sunset": warm parchment land, dusty rose water, terracotta
// borders. Applied on top of OpenFreeMap's dark style once it has loaded, so
// the tiles and layer ids stay the vendor's and only the paint changes. The
// colours are the `--color-map-*` tokens in globals.css.

// Roads, rail, buildings and airports are modern clutter on a map of the
// ancient world. Matched by source-layer so new vendor layers in these groups
// are hidden too.
const HIDDEN_SOURCE_LAYERS = new Set([
  "transportation",
  "transportation_name",
  "building",
  "aeroway",
])

const FILL_BY_ID: Record<string, MapColor> = {
  background: "map-land",
  water: "map-water",
  landcover_ice_shelf: "map-ice",
  landcover_glacier: "map-ice",
  landuse_residential: "map-town",
  landcover_wood: "map-woods",
  landuse_park: "map-woods",
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
}
