"use client"

import { X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useInViewport } from "~/hooks/useInViewport"
import { MAP_HEIGHT } from "~/lib/constants"
import type {
  Event as TimelineEvent,
  Timeline as TimelineType,
} from "../../data/timelines/types"
import { Timeline } from "../ui/Timeline"
import { TimelineInfoBox } from "../ui/TimelineInfoBox"
import { Map } from "./Map"

const ROME_DEFAULT: [number, number] = [41.9028, 12.4964]

/**
 * Validates and sanitizes coordinates, returning safe values or Rome default
 */
function sanitizeCoordinates(
  lat: number | undefined | null,
  lng: number | undefined | null,
): [number, number] {
  const validLat =
    typeof lat === "number" && isFinite(lat) && !isNaN(lat)
      ? lat
      : ROME_DEFAULT[0]
  const validLng =
    typeof lng === "number" && isFinite(lng) && !isNaN(lng)
      ? lng
      : ROME_DEFAULT[1]
  return [validLat, validLng]
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
      : ROME_DEFAULT

  const [activeTimelineEvent, setActiveTimelineEvent] = useState<{
    lat: number
    lng: number
    name: string
    year: number
    description?: string
  } | null>(null)
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

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

  // Detect when map enters viewport to lazy load it
  const isMapInViewport = useInViewport(mapContainerRef)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)")

    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches)
    }

    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)

    return () => {
      mediaQuery.removeEventListener("change", updateViewport)
    }
  }, [])

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

  const currentEvent = allEvents[selectedEventIndex] || null

  const mobilePreviewCenter = (() => {
    const birthEvent = allEvents.find(
      (event) => event.kind === "birth" && hasValidCoordinates(event),
    )

    if (birthEvent?.lat !== undefined && birthEvent.lng !== undefined) {
      return sanitizeCoordinates(birthEvent.lat, birthEvent.lng)
    }

    const firstEventWithCoordinates = allEvents.find((event) =>
      hasValidCoordinates(event),
    )

    if (
      firstEventWithCoordinates?.lat !== undefined &&
      firstEventWithCoordinates.lng !== undefined
    ) {
      return sanitizeCoordinates(
        firstEventWithCoordinates.lat,
        firstEventWithCoordinates.lng,
      )
    }

    return validatedInitialCenter
  })()

  const setActiveTimelineMarker = useCallback(
    (event: TimelineEvent | null) => {
      if (!event || !hasValidCoordinates(event)) {
        setActiveTimelineEvent(null)
        return
      }

      const [validLat, validLng] = sanitizeCoordinates(event.lat!, event.lng!)

      setActiveTimelineEvent({
        lat: validLat,
        lng: validLng,
        name: event.name ?? "Timeline Event",
        year: event.year ?? 0,
        description: event.description,
      })
    },
    [hasValidCoordinates],
  )

  // Callback to receive navigate function from Map
  const handleMapNavigate = useCallback(
    (navigateFn: (center: [number, number], zoom: number) => void) => {
      navigateMapRef.current = navigateFn

      if (!isMobileModalOpen) return

      if (currentEvent && hasValidCoordinates(currentEvent)) {
        const [validLat, validLng] = sanitizeCoordinates(
          currentEvent.lat!,
          currentEvent.lng!,
        )
        navigateFn([validLat, validLng], eventZoomLevel)
      } else {
        navigateFn(mobilePreviewCenter, initialZoom)
      }
    },
    [
      currentEvent,
      eventZoomLevel,
      hasValidCoordinates,
      initialZoom,
      isMobileModalOpen,
      mobilePreviewCenter,
    ],
  )

  useEffect(() => {
    if (!isMobileModalOpen) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileModalOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.body.style.overflow = "unset"
    }
  }, [isMobileModalOpen])

  useEffect(() => {
    if (isMobileModalOpen) return

    setActiveTimelineEvent(null)
    navigateMapRef.current = null
  }, [isMobileModalOpen])

  useEffect(() => {
    if (!isMobileModalOpen || !currentEvent) return

    setActiveTimelineMarker(currentEvent)

    if (!navigateMapRef.current || !hasValidCoordinates(currentEvent)) return

    const [validLat, validLng] = sanitizeCoordinates(
      currentEvent.lat!,
      currentEvent.lng!,
    )

    navigateMapRef.current([validLat, validLng], eventZoomLevel)
  }, [
    currentEvent,
    eventZoomLevel,
    hasValidCoordinates,
    isMobileModalOpen,
    setActiveTimelineMarker,
  ])

  // No automatic initialization - map stays on Rome until user interacts
  // The selectedEventIndex starts at 0 to show first event in info box

  /**
   * Navigate to an event on the map if it has valid coordinates
   */
  const navigateToEvent = useCallback(
    (event: TimelineEvent) => {
      setActiveTimelineMarker(event)

      if (!hasValidCoordinates(event) || !navigateMapRef.current) return

      const lat = event.lat!
      const lng = event.lng!

      if (!isFinite(lat) || !isFinite(lng) || isNaN(lat) || isNaN(lng)) return

      const [validLat, validLng] = sanitizeCoordinates(lat, lng)
      navigateMapRef.current([validLat, validLng], eventZoomLevel)
    },
    [eventZoomLevel, hasValidCoordinates, setActiveTimelineMarker],
  )

  // Handle timeline event click - update selected event index and info box
  const handleEventClick = useCallback(
    (event: TimelineEvent) => {
      const eventIndex = allEvents.findIndex(
        (e) => e.name === event.name && e.year === event.year,
      )

      if (eventIndex !== -1) {
        setSelectedEventIndex(eventIndex)

        if (isMobileViewport) {
          setActiveTimelineMarker(allEvents[eventIndex] ?? event)
          setIsMobileModalOpen(true)
          return
        }

        navigateToEvent(event)
      }
    },
    [allEvents, isMobileViewport, navigateToEvent, setActiveTimelineMarker],
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

    if (newEvent) {
      navigateToEvent(newEvent)
    }
  }, [selectedEventIndex, allEvents, navigateToEvent])

  const handleNextEvent = useCallback(() => {
    if (allEvents.length === 0) return

    const newIndex =
      selectedEventIndex >= allEvents.length - 1
        ? 0 // Wrap to first event
        : selectedEventIndex + 1

    const newEvent = allEvents[newIndex]
    setSelectedEventIndex(newIndex)

    if (newEvent) {
      navigateToEvent(newEvent)
    }
  }, [selectedEventIndex, allEvents, navigateToEvent])

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
          enableMobileDrawer={false}
          className="timeline-in-map lg:hidden"
        />
        <Timeline
          timeline={timeline}
          onEventClick={handleEventClick}
          selectedEventIndex={selectedEventIndex}
          enableMobileDrawer={false}
          className="timeline-in-map hidden lg:block"
        />
      </div>

      {/* Map Container - wraps both mobile and desktop views for intersection observer */}
      <div ref={mapContainerRef}>
        {/* Mobile static map preview */}
        {isMobileViewport && (
          <div className="lg:hidden">
            {showHeaders && (
              <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">
                Map
              </h2>
            )}
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(true)}
              className="relative block w-full overflow-hidden rounded-lg text-left focus:ring-2 focus:ring-amber-400 focus:outline-none"
              aria-label="Open interactive map and event details"
            >
              <div className="pointer-events-none">
                {!isMobileModalOpen && isMapInViewport ? (
                  <Map
                    center={mobilePreviewCenter}
                    zoom={initialZoom}
                    height={MAP_HEIGHT}
                    width="100%"
                    showProvinceLabels={showProvinceLabels}
                    hideControls={true}
                    {...mapProps}
                  />
                ) : (
                  <div className="flex h-[400px] items-center justify-center bg-slate-100">
                    <div className="text-slate-400">
                      Tap to open interactive map
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur-sm">
                Open interactive map
              </div>
            </button>
          </div>
        )}

        {/* Desktop-only header */}
        {!isMobileViewport && (
          <div className="hidden lg:block">
            {showHeaders && (
              <h2 className="mb-4 px-4 text-2xl font-bold text-slate-800">
                Map
              </h2>
            )}
          </div>
        )}

        {/* Desktop map and info */}
        {!isMobileViewport && (
          <div className="hidden lg:flex lg:flex-row">
            <div className="h-[400px] lg:w-2/3">
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
                <div className="flex h-[400px] items-center justify-center bg-slate-100">
                  <div className="text-slate-400">Loading map...</div>
                </div>
              )}
            </div>

            <div className="h-[400px] lg:w-1/3">
              <TimelineInfoBox
                event={currentEvent}
                onPrevious={handlePreviousEvent}
                onNext={handleNextEvent}
                hasPrevious={allEvents.length > 1}
                hasNext={allEvents.length > 1}
              />
            </div>
          </div>
        )}
      </div>

      {isMobileViewport && isMobileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-900 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Map and timeline event details"
        >
          <div className="pointer-events-auto absolute top-4 right-4 z-[1100]">
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(false)}
              className="rounded-full bg-slate-900/80 p-2 text-slate-100 shadow-lg backdrop-blur-sm transition-opacity hover:opacity-90 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              aria-label="Close map and event details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-full flex-col bg-slate-900">
            <div className="relative h-[52dvh] min-h-[360px] overflow-hidden border-b border-slate-700/70">
              <Map
                center={mobilePreviewCenter}
                zoom={initialZoom}
                height="52dvh"
                width="100%"
                showProvinceLabels={showProvinceLabels}
                hideControls={true}
                timelineEventMarker={validatedTimelineMarker}
                onNavigate={handleMapNavigate}
                {...mapProps}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/60 to-transparent" />
            </div>

            <div className="min-h-0 flex-1 bg-slate-900 pt-3">
              <TimelineInfoBox
                event={currentEvent}
                onPrevious={handlePreviousEvent}
                onNext={handleNextEvent}
                hasPrevious={allEvents.length > 1}
                hasNext={allEvents.length > 1}
                className="h-full bg-slate-900"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
