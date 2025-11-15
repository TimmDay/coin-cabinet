"use client"

import { useCallback, useState } from "react"
import { Timeline } from "../ui/Timeline"
import { Map } from "./Map"
import type { Timeline as TimelineType } from "./timelines/types"

export type TimelineWithMapProps = {
  timeline: TimelineType
  className?: string
  initialCenter?: [number, number]
  initialZoom?: number
  /**
   * Zoom level to use when focusing on a timeline event location.
   * Higher numbers = more zoomed in (8 = city level, 10 = street level)
   */
  eventZoomLevel?: number
  /**
   * Show AD 117 empire extent layer on the map
   */
  showAD117?: boolean
  /**
   * Show province labels on the map
   */
  showProvinceLabels?: boolean
  /**
   * Show section headers for Timeline and Map
   */
  showHeaders?: boolean
  /**
   * Additional props to pass to the Map component
   */
  mapProps?: Partial<React.ComponentProps<typeof Map>>
}

/**
 * Combined Timeline and Map component with interactive linking.
 * When users click timeline markers with coordinates, the map flies to that location.
 */
export function TimelineWithMap({
  timeline,
  className = "",
  initialCenter = [41.9028, 12.4964], // Rome default
  initialZoom = 5,
  eventZoomLevel = 5,
  showProvinceLabels = true,
  showHeaders = true,
  mapProps = {},
}: TimelineWithMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter)
  const [mapZoom, setMapZoom] = useState(initialZoom)
  const [activeTimelineEvent, setActiveTimelineEvent] = useState<{
    lat: number
    lng: number
    name: string
    year: number
    description?: string
  } | null>(null)

  // Handle timeline event interaction - pan map to event location and show marker
  const handleEventInteraction = useCallback(
    (event: {
      lat?: number
      lng?: number
      name?: string
      year?: number
      description?: string
    }) => {
      // If the event has coordinates, fly the map to that location and show marker
      if (event.lat !== undefined && event.lng !== undefined) {
        setMapCenter([event.lat, event.lng])
        setMapZoom(eventZoomLevel)
        setActiveTimelineEvent({
          lat: event.lat,
          lng: event.lng,
          name: event.name ?? "Timeline Event",
          year: event.year ?? 0,
          description: event.description,
        })
      }
    },
    [eventZoomLevel],
  )

  return (
    <div className={`mt-12 flex flex-col space-y-10 md:mt-8 ${className}`}>
      {/* Timeline at top */}
      <div className="px-0">
        {showHeaders && (
          <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">
            Timeline
          </h2>
        )}
        <Timeline
          timeline={timeline}
          onEventInteraction={handleEventInteraction}
        />
      </div>

      {/* Map at bottom */}
      <div className="mt-4 px-4">
        {showHeaders && (
          <h2 className="mb-4 text-2xl font-bold text-slate-800">Map</h2>
        )}
        <Map
          center={mapCenter}
          zoom={mapZoom}
          height="500px"
          width="100%"
          showProvinceLabels={showProvinceLabels}
          hideControls={true}
          timelineEventMarker={activeTimelineEvent}
          {...mapProps}
        />
      </div>
    </div>
  )
}
