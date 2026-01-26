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

/**
 * Hook to detect when an element enters the viewport
 */
function useInViewport(ref: React.RefObject<HTMLDivElement | null>) {
  const [isInViewport, setIsInViewport] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInViewport(true)
          // Once in viewport, stop observing
          observer.disconnect()
        }
      },
      {
        rootMargin: "100px", // Load slightly before entering viewport
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return isInViewport
}

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
  // Validate initialCenter and use Rome as fallback
  const validatedInitialCenter: [number, number] =
    Array.isArray(initialCenter) &&
    initialCenter.length === 2 &&
    typeof initialCenter[0] === "number" &&
    typeof initialCenter[1] === "number" &&
    !isNaN(initialCenter[0]) &&
    !isNaN(initialCenter[1]) &&
    isFinite(initialCenter[0]) &&
    isFinite(initialCenter[1])
      ? initialCenter
      : [41.9028, 12.4964] // Rome default fallback

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

  // Ref for timeline container to enable scrolling
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  // Ref for map container to enable scrolling to bottom and lazy loading detection
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Store the navigate function from Map component
  const navigateMapRef = useRef<
    ((center: [number, number], zoom: number) => void) | null
  >(null)

  // Callback to receive navigate function from Map
  const handleMapNavigate = useCallback(
    (navigateFn: (center: [number, number], zoom: number) => void) => {
      navigateMapRef.current = navigateFn
    },
    [],
  )

  // Detect when map enters viewport to lazy load it
  const isMapInViewport = useInViewport(mapContainerRef)

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
      const eventIndex = allEvents.findIndex(
        (e) => e.name === event.name && e.year === event.year,
      )
      if (eventIndex !== -1) {
        setSelectedEventIndex(eventIndex)
        // Navigate map if event has valid coordinates
        if (hasValidCoordinates(event)) {
          const lat = event.lat!
          const lng = event.lng!
          if (isFinite(lat) && isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
            const validLat =
              typeof lat === "number" && isFinite(lat) && !isNaN(lat)
                ? lat
                : 41.9028
            const validLng =
              typeof lng === "number" && isFinite(lng) && !isNaN(lng)
                ? lng
                : 12.4964

            // Use the navigate function instead of setState
            if (navigateMapRef.current) {
              navigateMapRef.current([validLat, validLng], eventZoomLevel)
            }

            setActiveTimelineEvent({
              lat: validLat,
              lng: validLng,
              name: event.name ?? "Timeline Event",
              year: event.year ?? 0,
              description: event.description,
            })
          }
        }
      }
    },
    [allEvents, hasValidCoordinates, eventZoomLevel],
  )

  // Navigation functions for info box
  const handlePreviousEvent = useCallback(() => {
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

        if (navigateMapRef.current) {
          navigateMapRef.current([validLat, validLng], eventZoomLevel)
        }
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
    if (allEvents.length === 0) return

    const newIndex =
      selectedEventIndex >= allEvents.length - 1
        ? 0 // Wrap to first event
        : selectedEventIndex + 1

    const newEvent = allEvents[newIndex]
    setSelectedEventIndex(newIndex)

    // Navigate map if event has valid coordinates
    if (newEvent && hasValidCoordinates(newEvent) && navigateMapRef.current) {
      const lat = newEvent.lat!
      const lng = newEvent.lng!
      if (isFinite(lat) && isFinite(lng) && !isNaN(lat) && !isNaN(lng)) {
        const validLat =
          typeof lat === "number" && isFinite(lat) && !isNaN(lat)
            ? lat
            : 41.9028
        const validLng =
          typeof lng === "number" && isFinite(lng) && !isNaN(lng)
            ? lng
            : 12.4964

        if (navigateMapRef.current) {
          navigateMapRef.current([validLat, validLng], eventZoomLevel)
        }
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

  // Validate timeline event marker before passing to Map
  const validatedTimelineMarker =
    activeTimelineEvent &&
    typeof activeTimelineEvent.lat === "number" &&
    typeof activeTimelineEvent.lng === "number" &&
    !isNaN(activeTimelineEvent.lat) &&
    !isNaN(activeTimelineEvent.lng) &&
    isFinite(activeTimelineEvent.lat) &&
    isFinite(activeTimelineEvent.lng)
      ? activeTimelineEvent
      : null

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

      {/* Map Container - wraps both mobile and desktop views for intersection observer */}
      <div ref={mapContainerRef}>
        {/* Map - shared for mobile and desktop */}
        <div className="lg:hidden">
          {showHeaders && (
            <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">Map</h2>
          )}
        </div>

        {/* Desktop-only header */}
        <div className="hidden lg:block">
          {showHeaders && (
            <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">Map</h2>
          )}
        </div>

        {/* Single Map instance for both mobile and desktop */}
        <div className="flex flex-col lg:flex-row">
          {/* Map section - full width on mobile, 2/3 on desktop */}
          <div
            className="-mx-4 md:mx-0 md:px-0 lg:mx-0 lg:w-2/3"
            style={{ height: MAP_HEIGHT }}
          >
            {isMapInViewport ? (
              <Map
                center={validatedInitialCenter}
                zoom={initialZoom}
                height={MAP_HEIGHT}
                width="100%"
                showProvinceLabels={showProvinceLabels}
                hideControls={true}
                timelineEventMarker={validatedTimelineMarker}
                onNavigate={handleMapNavigate}
                {...mapProps}
              />
            ) : (
              <div
                style={{ height: MAP_HEIGHT }}
                className="flex items-center justify-center bg-slate-100"
              >
                <div className="text-slate-400">Loading map...</div>
              </div>
            )}
          </div>

          {/* Info Box - hidden on mobile, 1/3 width on desktop */}
          <div
            className="hidden lg:block lg:w-1/3"
            style={{ height: MAP_HEIGHT }}
          >
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
    </div>
  )
}
