import L from "leaflet"
import Supercluster from "supercluster"
import type { CustomMapMarker } from "./mapMarkers"

export type ClusterFeatureProperties = {
  cluster?: boolean
  cluster_id?: number
  point_count?: number
  point_count_abbreviated?: string | number
  markerId?: string
}

export type SpiderfiedMarker = {
  marker: CustomMapMarker
  position: [number, number]
  leg: [[number, number], [number, number]]
}

export type SpiderfiedClusterState = {
  clusterId: number
  markers: SpiderfiedMarker[]
}

export type ClusteredMarker =
  | {
      type: "cluster"
      id: number
      lat: number
      lng: number
      count: number
      expansionZoom: number
    }
  | {
      type: "marker"
      marker: CustomMapMarker
    }

export function buildMarkerLookup(markers: CustomMapMarker[]) {
  const lookup: Record<string, CustomMapMarker> = {}

  for (const marker of markers) {
    lookup[marker.id] = marker
  }

  return lookup
}

export function createCustomMarkerClusterIndex(
  markers: CustomMapMarker[],
): Supercluster<ClusterFeatureProperties> | null {
  if (markers.length === 0) {
    return null
  }

  const index = new Supercluster<ClusterFeatureProperties>({
    radius: 52,
    maxZoom: 17,
    minZoom: 0,
  })

  index.load(
    markers.map((marker) => ({
      type: "Feature" as const,
      properties: {
        markerId: marker.id,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [marker.lng, marker.lat] as [number, number],
      },
    })),
  )

  return index
}

export function buildClusteredCustomMarkers({
  activeCustomMarkers,
  currentZoom,
  customMarkerClusterIndex,
  markerLookup,
  viewportBounds,
}: {
  activeCustomMarkers: CustomMapMarker[]
  currentZoom: number
  customMarkerClusterIndex: Supercluster<ClusterFeatureProperties> | null
  markerLookup: Record<string, CustomMapMarker>
  viewportBounds: [number, number, number, number]
}): ClusteredMarker[] {
  if (!customMarkerClusterIndex) {
    return activeCustomMarkers.map((marker) => ({
      type: "marker" as const,
      marker,
    }))
  }

  const zoomLevel = Math.max(0, Math.round(currentZoom))
  const clusteredMarkers: ClusteredMarker[] = []

  for (const feature of customMarkerClusterIndex.getClusters(
    viewportBounds,
    zoomLevel,
  )) {
    const [lng, lat] = feature.geometry.coordinates
    const properties = feature.properties ?? {}

    if (properties.cluster && properties.cluster_id !== undefined) {
      clusteredMarkers.push({
        type: "cluster",
        id: properties.cluster_id,
        lat,
        lng,
        count: properties.point_count ?? 0,
        expansionZoom: customMarkerClusterIndex.getClusterExpansionZoom(
          properties.cluster_id,
        ),
      })
      continue
    }

    if (!properties.markerId) {
      continue
    }

    const marker = markerLookup[properties.markerId]
    if (marker) {
      clusteredMarkers.push({
        type: "marker",
        marker,
      })
    }
  }

  return clusteredMarkers.concat(
    activeCustomMarkers.map((marker) => ({
      type: "marker" as const,
      marker,
    })),
  )
}

export function getCoordinateKey(lat: number, lng: number): string {
  return `${lat.toFixed(6)}:${lng.toFixed(6)}`
}

export function createSpiderfyPositions({
  map,
  center,
  markers,
}: {
  map: L.Map
  center: [number, number]
  markers: CustomMapMarker[]
}): SpiderfiedMarker[] {
  const markerCount = markers.length

  if (markerCount === 0) {
    return []
  }

  const centerLatLng = L.latLng(center[0], center[1])
  const centerPoint = map.latLngToLayerPoint(centerLatLng)

  return markers.map((marker, index) => {
    let offsetX = 0
    let offsetY = 0

    if (markerCount <= 8) {
      const angle = (Math.PI * 2 * index) / markerCount - Math.PI / 2
      const radius = markerCount <= 3 ? 28 : 38
      offsetX = Math.cos(angle) * radius
      offsetY = Math.sin(angle) * radius
    } else {
      const angle = index * 0.7
      const radius = 26 + index * 5
      offsetX = Math.cos(angle) * radius
      offsetY = Math.sin(angle) * radius
    }

    const spiderPoint = L.point(
      centerPoint.x + offsetX,
      centerPoint.y + offsetY,
    )
    const spiderLatLng = map.layerPointToLatLng(spiderPoint)
    const position: [number, number] = [spiderLatLng.lat, spiderLatLng.lng]

    return {
      marker,
      position,
      leg: [center, position],
    }
  })
}
