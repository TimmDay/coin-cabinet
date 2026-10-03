import type { Map as MapLibreMap } from "maplibre-gl"
import { describe, expect, it } from "vitest"
import {
  buildClusteredCustomMarkers,
  buildMarkerLookup,
  createCustomMarkerClusterIndex,
  createSpiderfyPositions,
  getCoordinateKey,
} from "./mapMarkerClustering"
import type { CustomMapMarker } from "./mapMarkers"

const marker = (id: string, lat: number, lng: number): CustomMapMarker => ({
  id,
  lat,
  lng,
  title: id,
  fillColor: "red",
  borderColor: "blue",
  className: "text-pin-wine",
})

const WORLD: [number, number, number, number] = [-180, -85, 180, 85]

function cluster(
  markers: CustomMapMarker[],
  active: CustomMapMarker[],
  zoom: number,
) {
  return buildClusteredCustomMarkers({
    activeCustomMarkers: active,
    currentZoom: zoom,
    customMarkerClusterIndex: createCustomMarkerClusterIndex(markers),
    markerLookup: buildMarkerLookup(markers),
    viewportBounds: WORLD,
  })
}

describe("buildClusteredCustomMarkers", () => {
  const nearby = [marker("a", 41.9, 12.5), marker("b", 41.91, 12.51)]

  it("draws plain markers when there is no index", () => {
    const items = buildClusteredCustomMarkers({
      activeCustomMarkers: [marker("x", 1, 1)],
      currentZoom: 5,
      customMarkerClusterIndex: null,
      markerLookup: {},
      viewportBounds: WORLD,
    })

    expect(items).toEqual([{ type: "marker", marker: marker("x", 1, 1) }])
  })

  it("clusters markers that are close together when zoomed out", () => {
    const items = cluster(nearby, [], 4)

    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ type: "cluster", count: 2 })
  })

  it("separates the same markers when zoomed in", () => {
    const items = cluster(nearby, [], 16)

    expect(items.map((item) => item.type)).toEqual(["marker", "marker"])
  })

  it("gives a cluster the zoom at which it breaks up", () => {
    const [item] = cluster(nearby, [], 4)

    expect(item?.type === "cluster" && item.expansionZoom).toBeGreaterThan(4)
  })

  it("adds active markers after the clustered ones, never clustering them", () => {
    const active = marker("now", 41.9, 12.5)
    const items = cluster(nearby, [active], 4)

    expect(items.map((item) => item.type)).toEqual(["cluster", "marker"])
    expect(items[1]).toEqual({ type: "marker", marker: active })
  })

  it("drops markers outside the viewport", () => {
    const items = buildClusteredCustomMarkers({
      activeCustomMarkers: [],
      currentZoom: 16,
      customMarkerClusterIndex: createCustomMarkerClusterIndex(nearby),
      markerLookup: buildMarkerLookup(nearby),
      viewportBounds: [100, 0, 110, 10],
    })

    expect(items).toEqual([])
  })
})

describe("createCustomMarkerClusterIndex", () => {
  it("is null for no markers", () => {
    expect(createCustomMarkerClusterIndex([])).toBeNull()
  })
})

describe("getCoordinateKey", () => {
  it("matches points that are the same to six places", () => {
    expect(getCoordinateKey(41.9, 12.5)).toBe(
      getCoordinateKey(41.9000001, 12.5),
    )
    expect(getCoordinateKey(41.9, 12.5)).not.toBe(getCoordinateKey(41.9, 12.6))
  })
})

// A map where one pixel is one degree: project and unproject are inverses.
const flatMap = {
  project: ([lng, lat]: [number, number]) => ({ x: lng, y: lat }),
  unproject: ([x, y]: [number, number]) => ({ lng: x, lat: y }),
} as unknown as MapLibreMap

describe("createSpiderfyPositions", () => {
  it("is empty for no markers", () => {
    expect(
      createSpiderfyPositions({ map: flatMap, center: [10, 20], markers: [] }),
    ).toEqual([])
  })

  it("fans up to eight markers on a ring around the centre", () => {
    const markers = ["a", "b", "c", "d"].map((id) => marker(id, 10, 20))
    const spread = createSpiderfyPositions({
      map: flatMap,
      center: [10, 20],
      markers,
    })

    expect(spread).toHaveLength(4)
    for (const { position } of spread) {
      // radius 38 for four markers, in the flat map's units
      expect(Math.hypot(position[1] - 20, position[0] - 10)).toBeCloseTo(38)
    }
    // the first marker sits straight up from the centre (screen y decreases)
    expect(spread[0]?.position[1]).toBeCloseTo(20)
    expect(spread[0]?.position[0]).toBeCloseTo(10 - 38)
  })

  it("uses a tighter ring for three markers or fewer", () => {
    const markers = ["a", "b", "c"].map((id) => marker(id, 10, 20))
    const [first] = createSpiderfyPositions({
      map: flatMap,
      center: [10, 20],
      markers,
    })

    expect(
      Math.hypot(
        (first?.position[1] ?? 0) - 20,
        (first?.position[0] ?? 0) - 10,
      ),
    ).toBeCloseTo(28)
  })

  it("spirals outward past eight markers", () => {
    const markers = Array.from({ length: 10 }, (_, i) =>
      marker(`m${i}`, 10, 20),
    )
    const spread = createSpiderfyPositions({
      map: flatMap,
      center: [10, 20],
      markers,
    })
    const radii = spread.map(({ position }) =>
      Math.hypot(position[1] - 20, position[0] - 10),
    )

    expect(radii[9]).toBeGreaterThan(radii[0]!)
    expect(radii[0]).toBeCloseTo(26)
  })

  it("draws each leg from the centre to the marker's position", () => {
    const spread = createSpiderfyPositions({
      map: flatMap,
      center: [10, 20],
      markers: [marker("a", 10, 20), marker("b", 10, 20)],
    })

    for (const { leg, position } of spread) {
      expect(leg[0]).toEqual([10, 20])
      expect(leg[1]).toEqual(position)
    }
  })
})
