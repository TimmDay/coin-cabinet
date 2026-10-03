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
  /** Called for a click or key press on a single marker (not on a cluster), with the screen point to open its popup at. */
  onMarkerClick: (marker: CustomMapMarker, point: ClickPoint) => void
}

export type ClickPoint = { clientX: number; clientY: number }

/**
 * Where a click on a marker happened. A key press on the marker's button is
 * reported as a click at 0,0, so for those the point is the middle of the
 * marker instead.
 */
export function clickPoint(event: MouseEvent): ClickPoint {
  if (event.detail === 0 && event.target instanceof Element) {
    const rect = event.target.getBoundingClientRect()
    return {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }
  }
  return { clientX: event.clientX, clientY: event.clientY }
}

/**
 * A marker's HTML as a keyboard-operable button. It is a div with a button
 * role because the pin HTML is made of divs. Enter and Space click it, which
 * reaches the map's marker click the way a mouse click does.
 */
function MarkerButton({ label, html }: { label: string; html: string }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      className="focus-visible:ring-pin-cream block cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          e.currentTarget.click()
        }
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
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
              <MarkerButton
                label={`Group of ${item.count} places, zoom in`}
                html={createClusterMarkerHtml(item.count)}
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
              onMarkerClick(item.marker, clickPoint(e.originalEvent))
              e.originalEvent.stopPropagation()
            }}
          >
            <MarkerButton
              label={item.marker.title || "Map marker"}
              html={createCustomMarkerHtml(item.marker)}
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
            onMarkerClick(marker, clickPoint(e.originalEvent))
            e.originalEvent.stopPropagation()
          }}
        >
          <MarkerButton
            label={marker.title || "Map marker"}
            html={createSpiderfiedMarkerHtml(marker)}
          />
        </Marker>
      ))}
    </>
  )
}
