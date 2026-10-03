import { act, renderHook } from "@testing-library/react"
import type { Map as MapLibreMap } from "maplibre-gl"
import { describe, expect, it, vi } from "vitest"
import type { CustomMapMarker } from "./mapMarkers"
import { useMarkerClusters } from "./useMarkerClusters"

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

function fakeMap() {
  const flyTo = vi.fn()
  const map = {
    project: ([lng, lat]: [number, number]) => ({ x: lng, y: lat }),
    unproject: ([x, y]: [number, number]) => ({ lng: x, lat: y }),
    flyTo,
  } as unknown as MapLibreMap
  return { map, flyTo }
}

const firstCluster = (items: ReturnType<typeof useMarkerClusters>["items"]) => {
  const cluster = items.find((item) => item.type === "cluster")
  if (cluster?.type !== "cluster") throw new Error("no cluster")
  return cluster
}

describe("useMarkerClusters", () => {
  const sameSpot = () => [marker("a", 41.9, 12.5), marker("b", 41.9, 12.5)]
  const apart = () => [marker("a", 41.9, 12.5), marker("b", 41.91, 12.51)]

  it("fans out a cluster of markers at one spot, and closes it on a second click", () => {
    const { map } = fakeMap()
    const { result } = renderHook(() => useMarkerClusters(sameSpot(), 4, WORLD))

    act(() =>
      result.current.onClusterClick(firstCluster(result.current.items), map),
    )
    expect(result.current.spiderfied?.markers).toHaveLength(2)

    act(() =>
      result.current.onClusterClick(firstCluster(result.current.items), map),
    )
    expect(result.current.spiderfied).toBeNull()
  })

  it("zooms in on a cluster whose markers are apart", () => {
    const { map, flyTo } = fakeMap()
    const { result } = renderHook(() => useMarkerClusters(apart(), 4, WORLD))
    const cluster = firstCluster(result.current.items)

    act(() => result.current.onClusterClick(cluster, map))

    expect(result.current.spiderfied).toBeNull()
    expect(flyTo).toHaveBeenCalledWith({
      center: [cluster.lng, cluster.lat],
      zoom: cluster.expansionZoom,
      duration: 600,
    })
  })

  it("closes the fan when asked", () => {
    const { map } = fakeMap()
    const { result } = renderHook(() => useMarkerClusters(sameSpot(), 4, WORLD))
    act(() =>
      result.current.onClusterClick(firstCluster(result.current.items), map),
    )

    act(() => result.current.clearSpiderfy())

    expect(result.current.spiderfied).toBeNull()
  })

  it("keeps the fan open when the parent hands over a new array of the same markers", () => {
    const { map } = fakeMap()
    const { result, rerender } = renderHook(
      ({ markers }) => useMarkerClusters(markers, 4, WORLD),
      { initialProps: { markers: sameSpot() } },
    )
    act(() =>
      result.current.onClusterClick(firstCluster(result.current.items), map),
    )

    rerender({ markers: sameSpot() })

    expect(result.current.spiderfied).not.toBeNull()
  })

  it("closes the fan when the markers change", () => {
    const { map } = fakeMap()
    const { result, rerender } = renderHook(
      ({ markers }) => useMarkerClusters(markers, 4, WORLD),
      { initialProps: { markers: sameSpot() } },
    )
    act(() =>
      result.current.onClusterClick(firstCluster(result.current.items), map),
    )

    rerender({ markers: [marker("c", 41.9, 12.5), marker("d", 41.9, 12.5)] })

    expect(result.current.spiderfied).toBeNull()
  })

  it("never clusters an active marker", () => {
    const markers = [
      { ...marker("a", 41.9, 12.5), isActive: true },
      marker("b", 41.9, 12.5),
    ]
    const { result } = renderHook(() => useMarkerClusters(markers, 4, WORLD))

    expect(result.current.items.map((item) => item.type)).toEqual([
      "marker",
      "marker",
    ])
  })

  it("uses the latest click handler after the markers are rebuilt", () => {
    // The index is kept across rebuilds, but a click must reach the new closure.
    const first = vi.fn()
    const second = vi.fn()
    const make = (onClick: () => void) => [{ ...marker("a", 10, 10), onClick }]
    const { result, rerender } = renderHook(
      ({ markers }) => useMarkerClusters(markers, 16, WORLD),
      { initialProps: { markers: make(first) } },
    )

    rerender({ markers: make(second) })
    const item = result.current.items[0]
    if (item?.type !== "marker") throw new Error("expected a marker")
    item.marker.onClick?.()

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })
})
