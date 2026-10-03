import type { Map as MapLibreMap } from "maplibre-gl"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  buildClusteredCustomMarkers,
  buildMarkerLookup,
  createCustomMarkerClusterIndex,
  createSpiderfyPositions,
  getCoordinateKey,
  type ClusteredMarker,
  type SpiderfiedClusterState,
} from "./mapMarkerClustering"
import type { CustomMapMarker } from "./mapMarkers"

export type ViewportBounds = [number, number, number, number]

type ClusterItem = Extract<ClusteredMarker, { type: "cluster" }>

/**
 * What decides the clusters: which markers there are, where, and which are
 * active. Callers rebuild their marker arrays on every render (their click
 * handlers close over state), so the index is keyed on this, not on identity.
 */
const markersKey = (markers: CustomMapMarker[]) =>
  markers
    .map((m) => `${m.id}@${m.lat},${m.lng}${m.isActive ? "!" : ""}`)
    .join("|")

/**
 * Clusters a set of markers for the current view, and handles clicking a
 * cluster: markers at one spot fan out (spiderfy), markers spread apart zoom
 * in. Active markers are never clustered.
 */
export function useMarkerClusters(
  markers: CustomMapMarker[],
  zoom: number,
  bounds: ViewportBounds,
) {
  const [spiderfied, setSpiderfied] = useState<SpiderfiedClusterState | null>(
    null,
  )

  const active = useMemo(() => markers.filter((m) => m.isActive), [markers])
  const clusterable = useMemo(
    () => markers.filter((m) => !m.isActive),
    [markers],
  )

  const key = markersKey(markers)

  // The index depends only on the markers' positions, so it survives a parent
  // that hands over a new array of the same markers.
  const index = useMemo(
    () => createCustomMarkerClusterIndex(clusterable),
    [key],
  )

  // The lookup is rebuilt from the latest markers, so a click always reaches
  // the current handler, not the one from when the index was built.
  const lookup = useMemo(() => buildMarkerLookup(clusterable), [clusterable])

  const items = useMemo(
    () =>
      buildClusteredCustomMarkers({
        activeCustomMarkers: active,
        currentZoom: zoom,
        customMarkerClusterIndex: index,
        markerLookup: lookup,
        viewportBounds: bounds,
      }),
    [active, zoom, index, lookup, bounds],
  )

  // A different set of markers closes any open fan.
  useEffect(() => {
    setSpiderfied(null)
  }, [key])

  const clearSpiderfy = useCallback(() => setSpiderfied(null), [])

  const onClusterClick = useCallback(
    (item: ClusterItem, map: MapLibreMap) => {
      if (!index) return

      const clustered = index
        .getLeaves(item.id, item.count)
        .map((leaf) => {
          const id = leaf.properties?.markerId
          return id ? lookup[id] : null
        })
        .filter((marker): marker is CustomMapMarker => marker != null)

      if (clustered.length === 0) return

      const spots = new Set(
        clustered.map((m) => getCoordinateKey(m.lat, m.lng)),
      )

      if (spots.size === 1) {
        setSpiderfied((current) =>
          current?.clusterId === item.id
            ? null
            : {
                clusterId: item.id,
                markers: createSpiderfyPositions({
                  map,
                  center: [item.lat, item.lng],
                  markers: clustered,
                }),
              },
        )
        return
      }

      setSpiderfied(null)
      map.flyTo({
        center: [item.lng, item.lat],
        zoom: item.expansionZoom,
        duration: 600,
      })
    },
    [index, lookup],
  )

  return { items, spiderfied, onClusterClick, clearSpiderfy }
}
