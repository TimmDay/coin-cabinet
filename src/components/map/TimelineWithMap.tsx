"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MAP_HEIGHT } from "~/lib/constants"
import type {
  Event as TimelineEvent,
  Timeline as TimelineType,
} from "../../data/timelines/types"
import { Timeline } from "../ui/Timeline"
import { TimelineInfoBox } from "../ui/TimelineInfoBox"
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

  // State for the info box - start at 0 to show first event details
  const [selectedEventIndex, setSelectedEventIndex] = useState(0)

  // Get all events from timeline (timeline is already an array of events)
  const allEvents = timeline || []

  // Don't render until we have data
  if (!timeline || timeline.length === 0) {
    return (
      <div className={`flex flex-col lg:flex-row ${className}`}>
        <div className="flex h-64 items-center justify-center text-slate-500">
          Loading timeline data...
        </div>
      </div>
    )
  }

  // Debug state changes
  useEffect(() => {
    console.log(
      "📊 State change - selectedEventIndex:",
      selectedEventIndex,
      "mapCenter:",
      mapCenter,
      "mapZoom:",
      mapZoom,
    )
    if (allEvents[selectedEventIndex]) {
      console.log("Current event:", allEvents[selectedEventIndex].name)
    }
  }, [selectedEventIndex, mapCenter, mapZoom, allEvents])

  // Ref for timeline container to enable scrolling
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  // Ref for map container to enable scrolling to bottom
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to validate coordinates
  const hasValidCoordinates = useCallback((event: TimelineEvent): boolean => {
    return (
      event.lat !== undefined &&
      event.lng !== undefined &&
      event.lat !== null &&
      event.lng !== null &&
      !isNaN(event.lat) &&
      !isNaN(event.lng) &&
      typeof event.lat === "number" &&
      typeof event.lng === "number"
    )
  }, [])

  // No automatic initialization - map stays on Rome until user interacts
  // The selectedEventIndex starts at 0 to show first event in info box

  // Handle timeline event click - update selected event index and info box
  const handleEventClick = useCallback(
    (event: TimelineEvent) => {
      console.log("🔥 handleEventClick called:", event.name, event.year)
      const eventIndex = allEvents.findIndex(
        (e) => e.name === event.name && e.year === event.year,
      )
      console.log(
        "Found eventIndex:",
        eventIndex,
        "setting selectedEventIndex from",
        selectedEventIndex,
        "to",
        eventIndex,
      )
      if (eventIndex !== -1) {
        setSelectedEventIndex(eventIndex)
        // Update map directly if event has valid coordinates
        if (hasValidCoordinates(event)) {
          const lat = event.lat!
          const lng = event.lng!
          if (isFinite(lat) && isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
            // Double-check coordinates are valid before setting state
            const validLat =
              typeof lat === "number" && isFinite(lat) && !isNaN(lat)
                ? lat
                : 41.9028
            const validLng =
              typeof lng === "number" && isFinite(lng) && !isNaN(lng)
                ? lng
                : 12.4964

            if (validLat !== lat || validLng !== lng) {
              console.warn("Corrected invalid coordinates in setMapCenter:", {
                original: [lat, lng],
                corrected: [validLat, validLng],
              })
            }

            setMapCenter([validLat, validLng])
            setMapZoom(eventZoomLevel)
            setActiveTimelineEvent({
              lat,
              lng,
              name: event.name ?? "Timeline Event",
              year: event.year ?? 0,
              description: event.description,
            })
          }
        }
      }
    },
    [allEvents, selectedEventIndex, hasValidCoordinates, eventZoomLevel],
  )

  // Navigation functions for info box
  const handlePreviousEvent = useCallback(() => {
    console.log(
      "⬅️  handlePreviousEvent called, current selectedEventIndex:",
      selectedEventIndex,
    )
    if (allEvents.length === 0) return

    const newIndex =
      selectedEventIndex <= 0
        ? allEvents.length - 1 // Wrap to last event
        : selectedEventIndex - 1

    const newEvent = allEvents[newIndex]
    setSelectedEventIndex(newIndex)

    // Update map directly
    if (newEvent && hasValidCoordinates(newEvent)) {
      const lat = newEvent.lat!
      const lng = newEvent.lng!
      if (isFinite(lat) && isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
        // Double-check coordinates are valid before setting state
        const validLat =
          typeof lat === "number" && isFinite(lat) && !isNaN(lat)
            ? lat
            : 41.9028
        const validLng =
          typeof lng === "number" && isFinite(lng) && !isNaN(lng)
            ? lng
            : 12.4964

        if (validLat !== lat || validLng !== lng) {
          console.warn(
            "Corrected invalid coordinates in handlePreviousEvent:",
            { original: [lat, lng], corrected: [validLat, validLng] },
          )
        }

        setMapCenter([validLat, validLng])
        setMapZoom(eventZoomLevel)
        setActiveTimelineEvent({
          lat: validLat,
          lng: validLng,
          name: newEvent.name ?? "Timeline Event",
          year: newEvent.year ?? 0,
          description: newEvent.description,
        })
      }
    }
  }, [selectedEventIndex, allEvents, hasValidCoordinates, eventZoomLevel])

  const handleNextEvent = useCallback(() => {
    console.log(
      "➡️  handleNextEvent called, current selectedEventIndex:",
      selectedEventIndex,
    )
    if (allEvents.length === 0) return

    const newIndex =
      selectedEventIndex >= allEvents.length - 1
        ? 0 // Wrap to first event
        : selectedEventIndex + 1

    const newEvent = allEvents[newIndex]
    setSelectedEventIndex(newIndex)

    // Update map directly
    if (newEvent && hasValidCoordinates(newEvent)) {
      const lat = newEvent.lat!
      const lng = newEvent.lng!
      if (isFinite(lat) && isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
        // Double-check coordinates are valid before setting state
        const validLat =
          typeof lat === "number" && isFinite(lat) && !isNaN(lat)
            ? lat
            : 41.9028
        const validLng =
          typeof lng === "number" && isFinite(lng) && !isNaN(lng)
            ? lng
            : 12.4964

        if (validLat !== lat || validLng !== lng) {
          console.warn("Corrected invalid coordinates in handleNextEvent:", {
            original: [lat, lng],
            corrected: [validLat, validLng],
          })
        }

        setMapCenter([validLat, validLng])
        setMapZoom(eventZoomLevel)
        setActiveTimelineEvent({
          lat: validLat,
          lng: validLng,
          name: newEvent.name ?? "Timeline Event",
          year: newEvent.year ?? 0,
          description: newEvent.description,
        })
      }
    }
  }, [selectedEventIndex, allEvents, hasValidCoordinates, eventZoomLevel])

  const currentEvent = allEvents[selectedEventIndex] || null

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Timeline at top */}
      <div ref={timelineContainerRef} className="pr-2">
        {showHeaders && (
          <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">
            Timeline
          </h2>
        )}
        <Timeline
          timeline={timeline}
          onEventClick={handleEventClick}
          selectedEventIndex={selectedEventIndex}
          hideTooltips={false}
          className="timeline-in-map lg:hidden"
        />
        <Timeline
          timeline={timeline}
          onEventClick={handleEventClick}
          selectedEventIndex={selectedEventIndex}
          hideTooltips={true}
          className="timeline-in-map hidden lg:block"
        />
      </div>

      {/* Mobile: Map only */}
      <div ref={mapContainerRef} className="-mx-4 md:mx-0 md:px-0 lg:hidden">
        {showHeaders && (
          <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">Map</h2>
        )}
        <Map
          center={mapCenter}
          zoom={mapZoom}
          width="100%"
          showProvinceLabels={showProvinceLabels}
          hideControls={true}
          timelineEventMarker={activeTimelineEvent}
          {...mapProps}
        />
      </div>

      {/* Desktop: Map and Info Box side by side */}
      <div className="hidden lg:flex lg:flex-1">
        {/* Map section - 2/3 width */}
        <div ref={mapContainerRef} className="w-2/3">
          {showHeaders && (
            <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">Map</h2>
          )}
          <Map
            center={mapCenter}
            zoom={mapZoom}
            width="100%"
            showProvinceLabels={showProvinceLabels}
            hideControls={true}
            timelineEventMarker={activeTimelineEvent}
            {...mapProps}
          />
        </div>

        {/* Info Box section - 1/3 width, height matches map */}
        <div className="w-1/3" style={{ height: MAP_HEIGHT }}>
          <TimelineInfoBox
            event={currentEvent}
            onPrevious={handlePreviousEvent}
            onNext={handleNextEvent}
            hasPrevious={allEvents.length > 1}
            hasNext={allEvents.length > 1}
          />
        </div>
      </div>
    </div>
  )
}
