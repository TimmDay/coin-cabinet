"use client"

import { X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useInViewport } from "~/hooks/useInViewport"
import { MAP_HEIGHT, MAP_HEIGHT_DESKTOP } from "~/lib/constants"
import type {
  Event as TimelineEvent,
  Timeline as TimelineType,
} from "../../data/timelines/types"
import { Timeline } from "../ui/Timeline"
import { TimelineInfoBox } from "../ui/TimelineInfoBox"
import { Map, type CustomMapMarker } from "./Map"
import { type LatLng, parseLatLng, ROME } from "./coordinates"
import { COIN_PAGE_TIER, type Tier } from "./jurisdictions"
import { pinStyle } from "./pinStyle"

const NO_MARKERS: CustomMapMarker[] = []
const NO_EVENTS: TimelineEvent[] = []
/** Where an event sits on the map, or null when it has no usable coordinates. */
function eventPosition(event: TimelineEvent): LatLng | null {
  return parseLatLng(event.lat, event.lng)
}

export type TimelineWithMapProps = {
  timeline: TimelineType
  className?: string
  initialCenter?: [number, number]
  /**
   * Where the small-screen preview map rests before it is tapped, typically
   * the mint. Falls back to the birth event, then the first located event.
   */
  previewCenter?: [number, number]
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
  /**
   * Extra markers to render alongside the timeline event markers.
   */
  additionalMarkers?: CustomMapMarker[]
  /**
   * Whether default mint pins from the mints table should be shown.
   */
  showDefaultMintMarkers?: boolean
  /**
   * The year the map draws its Jurisdictions at. Omitted or null leaves the
   * Jurisdiction layer off entirely.
   */
  selectedYear?: number | null
}

/**
 * Combined Timeline and Map component with interactive linking.
 * When users click timeline markers with coordinates, the map flies to that location.
 */
export function TimelineWithMap({
  timeline,
  className = "",
  initialCenter = ROME,
  previewCenter,
  initialZoom = 5,
  eventZoomLevel = 5,
  showProvinceLabels = true,
  showHeaders = true,
  mapProps = {},
  additionalMarkers = NO_MARKERS,
  showDefaultMintMarkers = true,
  selectedYear,
}: TimelineWithMapProps) {
  const validatedInitialCenter = useMemo(
    () => parseLatLng(initialCenter[0], initialCenter[1]) ?? ROME,
    [initialCenter],
  )

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  // State for the info box - start at 0 to show first event details
  const [selectedEventIndex, setSelectedEventIndex] = useState(0)

  // Get all events from timeline (timeline is already an array of events)
  const allEvents = timeline ?? NO_EVENTS

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

  const currentEvent = allEvents[selectedEventIndex] ?? null

  const mobilePreviewCenter: LatLng = (() => {
    const birthEvent = allEvents.find(
      (event) => event.kind === "birth" && eventPosition(event),
    )
    const firstLocated = allEvents.find((event) => eventPosition(event))
    const located = birthEvent ?? firstLocated

    return (located && eventPosition(located)) ?? validatedInitialCenter
  })()

  // Callback to receive navigate function from Map
  const handleMapNavigate = useCallback(
    (navigateFn: (center: [number, number], zoom: number) => void) => {
      navigateMapRef.current = navigateFn

      if (!isMobileModalOpen) return

      const position = currentEvent && eventPosition(currentEvent)
      if (position) {
        navigateFn(position, eventZoomLevel)
      } else {
        navigateFn(mobilePreviewCenter, initialZoom)
      }
    },
    [
      currentEvent,
      eventZoomLevel,
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

    navigateMapRef.current = null
  }, [isMobileModalOpen])

  useEffect(() => {
    if (!isMobileModalOpen || !currentEvent) return

    const position = eventPosition(currentEvent)
    if (!navigateMapRef.current || !position) return

    navigateMapRef.current(position, eventZoomLevel)
  }, [currentEvent, eventZoomLevel, isMobileModalOpen])

  // No automatic initialization - map stays on Rome until user interacts
  // The selectedEventIndex starts at 0 to show first event in info box

  /**
   * Navigate to an event on the map if it has valid coordinates
   */
  const navigateToEvent = useCallback(
    (event: TimelineEvent) => {
      const position = eventPosition(event)
      if (!position || !navigateMapRef.current) return

      navigateMapRef.current(position, eventZoomLevel)
    },
    [eventZoomLevel],
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
          setIsMobileModalOpen(true)
          return
        }

        navigateToEvent(event)
      }
    },
    [allEvents, isMobileViewport, navigateToEvent],
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

  const handleTimelineMarkerSelection = useCallback(
    (event: TimelineEvent, eventIndex: number) => {
      setSelectedEventIndex(eventIndex)
      if (isMobileViewport) {
        setIsMobileModalOpen(true)
        return
      }

      navigateToEvent(event)
    },
    [isMobileViewport, navigateToEvent],
  )

  // The same markers for the same events and selection, so the map does not
  // rebuild its marker index on every render.
  // The markers hold an onClick that reaches navigateMapRef, but only when a
  // click fires, which is not during render. The rule follows the closure
  // rather than the call.
  /* eslint-disable react-hooks/refs */
  const combinedCustomMarkers = useMemo(() => {
    const timelineMarkers: CustomMapMarker[] = []

    for (const [index, event] of allEvents.entries()) {
      const position = eventPosition(event)
      if (!position) continue

      const [lat, lng] = position
      const isCoinMinted = event.kind === "coin-minted"
      const isFound = event.kind === "found"

      timelineMarkers.push({
        id: `timeline-marker-${event.kind}-${event.year}-${index}`,
        lat,
        lng,
        title: event.name,
        subtitle: isCoinMinted
          ? "This coin was minted here"
          : isFound
            ? "This coin was found here"
            : undefined,
        description: event.description,
        ...pinStyle(isCoinMinted ? "minted" : isFound ? "found" : "event"),
        isActive: index === selectedEventIndex,
        showPopup: false,
        onClick: () => handleTimelineMarkerSelection(event, index),
        zIndexOffset: index === selectedEventIndex ? 1000 : 100,
      })
    }

    return timelineMarkers.concat(additionalMarkers)
  }, [
    allEvents,
    additionalMarkers,
    selectedEventIndex,
    handleTimelineMarkerSelection,
  ])
  /* eslint-enable react-hooks/refs */

  // Above the early return: a hook after it is only called on some renders,
  // which changes hook order the moment the timeline loads and throws.
  const [tier, setTier] = useState<Tier>(COIN_PAGE_TIER)

  // Don't render until we have data
  if (allEvents.length === 0) {
    return (
      <div className={`flex flex-col lg:flex-row ${className}`}>
        <div className="text-moonlight flex h-64 items-center justify-center">
          Loading timeline data...
        </div>
      </div>
    )
  }

  // What the three maps (preview, desktop, full screen) have in common; each
  // adds its own centre and height
  const sharedMapProps = {
    ...mapProps,
    zoom: initialZoom,
    width: "100%",
    showProvinceLabels,
    showMintMarkers: showDefaultMintMarkers,
    customMarkers: combinedCustomMarkers,
    // A coin's map shows the geography of the coin's own year. Null leaves the
    // Jurisdiction layer off rather than drawing some other year's geography.
    ...(selectedYear !== null && selectedYear !== undefined
      ? { selectedYear, tier, onTierChange: setTier }
      : {}),
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Map Container - wraps both mobile and desktop views for intersection observer */}
      <div ref={mapContainerRef}>
        {/* Mobile static map preview */}
        {isMobileViewport && (
          <div className="lg:hidden">
            {showHeaders && (
              <h2 className="text-ink mb-4 px-4 text-2xl font-bold">Map</h2>
            )}
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(true)}
              className="focus:ring-bronze-light relative block w-full overflow-hidden rounded-lg text-left focus:ring-2 focus:outline-none"
              aria-label="Open interactive map and event details"
            >
              <div className="pointer-events-none">
                {!isMobileModalOpen && isMapInViewport ? (
                  <Map
                    {...sharedMapProps}
                    center={previewCenter ?? mobilePreviewCenter}
                    height={MAP_HEIGHT}
                  />
                ) : (
                  <div className="bg-surface-raised flex h-[400px] items-center justify-center">
                    <div className="text-moonlight">
                      Tap to open interactive map
                    </div>
                  </div>
                )}
              </div>
              <div className="from-night/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
              <div className="bg-night/80 text-moonlight-bright pointer-events-none absolute right-3 bottom-3 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm">
                Open interactive map
              </div>
            </button>
          </div>
        )}

        {/* Desktop-only header */}
        {!isMobileViewport && (
          <div className="hidden lg:block">
            {showHeaders && (
              <h2 className="text-ink mb-4 px-4 text-2xl font-bold">Map</h2>
            )}
          </div>
        )}

        {/* Desktop map and info */}
        {!isMobileViewport && (
          <div className="hidden lg:flex lg:flex-row">
            <div className="h-[520px] lg:w-2/3">
              {isMapInViewport ? (
                <Map
                  {...sharedMapProps}
                  center={validatedInitialCenter}
                  height={MAP_HEIGHT_DESKTOP}
                  onNavigate={handleMapNavigate}
                />
              ) : (
                <div className="bg-surface-raised flex h-[520px] items-center justify-center">
                  <div className="text-moonlight">Loading map...</div>
                </div>
              )}
            </div>

            <div className="h-[520px] lg:w-1/3">
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

      {/* Timeline under the map */}
      <div ref={timelineContainerRef} className="mt-8 hidden pr-2 lg:block">
        {showHeaders && (
          <h2 className="text-ink mb-4 px-4 text-2xl font-bold">Timeline</h2>
        )}
        <Timeline
          timeline={timeline}
          onEventClick={handleEventClick}
          selectedEventIndex={selectedEventIndex}
          enableMobileDrawer={false}
          className="timeline-in-map"
        />
      </div>

      {isMobileViewport && isMobileModalOpen && (
        <div
          className="bg-night fixed inset-0 z-50 flex flex-col lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Map and timeline event details"
        >
          <div className="pointer-events-auto absolute top-4 right-4 z-[1100]">
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(false)}
              className="bg-night/80 text-moonlight-bright focus:ring-bronze-light rounded-full p-2 shadow-lg backdrop-blur-sm transition-opacity hover:opacity-90 focus:ring-2 focus:outline-none"
              aria-label="Close map and event details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-night flex h-full flex-col">
            <div className="border-line relative h-[52dvh] min-h-[360px] overflow-hidden border-b">
              <Map
                {...sharedMapProps}
                center={mobilePreviewCenter}
                height="52dvh"
                onNavigate={handleMapNavigate}
              />
              <div className="from-night/60 pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent" />
            </div>

            <div className="bg-night min-h-0 flex-1">
              <TimelineInfoBox
                event={currentEvent}
                onPrevious={handlePreviousEvent}
                onNext={handleNextEvent}
                hasPrevious={allEvents.length > 1}
                hasNext={allEvents.length > 1}
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
