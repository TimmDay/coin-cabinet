"use client"

import { useEffect, useMemo } from "react"
import { Layer, Marker, Source, useMap } from "react-map-gl/maplibre"
import { glColor } from "./mapColors"
import {
  createClusterMarkerHtml,
  createCustomMarkerHtml,
  createSpiderfiedMarkerHtml,
  type CustomMapMarker,
} from "./mapMarkers"
import { useMarkerClusters, type ViewportBounds } from "./useMarkerClusters"

type CustomMarkerLayerProps = {
  markers: CustomMapMarker[]
  zoom: number
  bounds: ViewportBounds
  /** Called for a click on a single marker (not on a cluster). */
  onMarkerClick: (marker: CustomMapMarker, event: MouseEvent) => void
}

/**
 * Draws a set of markers inside a map: clusters when they crowd, a fan of
 * markers (with legs) for a cluster at one spot, and the markers themselves.
 * Must be rendered as a child of the map. The fan closes when the map is
 * clicked or starts to move.
 */
export function CustomMarkerLayer({
  markers,
  zoom,
  bounds,
  onMarkerClick,
}: CustomMarkerLayerProps) {
  const { current: mapRef } = useMap()
  const { items, spiderfied, onClusterClick, clearSpiderfy } =
    useMarkerClusters(markers, zoom, bounds)

  useEffect(() => {
    const map = mapRef?.getMap()
    if (!map) return

    map.on("click", clearSpiderfy)
    map.on("movestart", clearSpiderfy)
    return () => {
      map.off("click", clearSpiderfy)
      map.off("movestart", clearSpiderfy)
    }
  }, [mapRef, clearSpiderfy])

  // The lines from a cluster's centre out to its fanned markers
  const legs = useMemo((): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: (spiderfied?.markers ?? []).map((item) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [item.leg[0][1], item.leg[0][0]],
            [item.leg[1][1], item.leg[1][0]],
          ],
        },
      })),
    }
  }, [spiderfied])

  return (
    <>
      {items.map((item) => {
        if (item.type === "cluster") {
          // Its markers are fanned out instead
          if (spiderfied?.clusterId === item.id) return null

          return (
            <Marker
              key={`custom-cluster-${item.id}`}
              longitude={item.lng}
              latitude={item.lat}
              anchor="center"
              onClick={(e) => {
                const map = mapRef?.getMap()
                if (map) onClusterClick(item, map)
                e.originalEvent.stopPropagation()
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: createClusterMarkerHtml(item.count),
                }}
              />
            </Marker>
          )
        }

        return (
          <Marker
            key={item.marker.id}
            longitude={item.marker.lng}
            latitude={item.marker.lat}
            anchor="bottom"
            onClick={(e) => {
              onMarkerClick(item.marker, e.originalEvent)
              e.originalEvent.stopPropagation()
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: createCustomMarkerHtml(item.marker),
              }}
            />
          </Marker>
        )
      })}

      {spiderfied && (
        <Source id="spider-legs" type="geojson" data={legs}>
          <Layer
            id="spider-legs-line"
            type="line"
            paint={{
              "line-color": glColor("pin-wine-mid"),
              "line-width": 2,
              "line-opacity": 0.6,
            }}
          />
        </Source>
      )}

      {spiderfied?.markers.map(({ marker, position }) => (
        <Marker
          key={`spiderfied-${marker.id}`}
          longitude={position[1]}
          latitude={position[0]}
          anchor="bottom"
          onClick={(e) => {
            onMarkerClick(marker, e.originalEvent)
            e.originalEvent.stopPropagation()
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: createSpiderfiedMarkerHtml(marker),
            }}
          />
        </Marker>
      ))}
    </>
  )
}
