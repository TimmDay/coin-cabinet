"use client"

import { useCallback, useRef, useState } from "react"
import type { Timeline as TimelineType } from "../../data/timelines/types"
import { Timeline } from "../ui/Timeline"
import { Map } from "./Map"

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

  // Ref for timeline container to enable scrolling
  const timelineContainerRef = useRef<HTMLDivElement>(null)

  // Handle timeline event hover - just pan map to event location and show marker (no scroll)
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

  // Handle timeline event click - pan map to event location, show marker, and scroll on mobile
  const handleEventClick = useCallback(
    (event: {
      lat?: number
      lng?: number
      name?: string
      year?: number
      description?: string
    }) => {
      // Auto-scroll timeline container to top of viewport on click (slower speed)
      if (timelineContainerRef.current) {
        // Use slower, more deliberate scroll timing
        timelineContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Override the default smooth behavior with custom timing
        const startY = window.pageYOffset
        const targetY = timelineContainerRef.current.offsetTop
        const distance = targetY - startY
        const duration = 800 // Slower: 800ms instead of default ~300ms
        let start: number | null = null

        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)

          // Ease-out function for smoother deceleration
          const easeOut = 1 - Math.pow(1 - progress, 3)

          window.scrollTo(0, startY + distance * easeOut)

          if (progress < 1) {
            requestAnimationFrame(step)
          }
        }

        requestAnimationFrame(step)
      }

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
    <div className={`flex flex-col${className}`}>
      {/* Timeline at top */}
      <div ref={timelineContainerRef} className="pr-2">
        {showHeaders && (
          <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">
            Timeline
          </h2>
        )}
        <Timeline
          timeline={timeline}
          onEventInteraction={handleEventInteraction}
          onEventClick={handleEventClick}
          className="timeline-in-map"
        />
      </div>

      {/* Map at bottom */}
      <div>
        {showHeaders && (
          <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">Map</h2>
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
