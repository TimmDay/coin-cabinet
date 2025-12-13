import Image from "next/image"
import { useEffect, useState } from "react"
import type {
  EventKind,
  Event as TimelineEvent,
  Timeline as TimelineType,
} from "../../data/timelines/types"
import { formatYear } from "~/lib/utils/date-formatting"
import {
  InvertedMarker,
  InvertedStackedMarkers,
  NormalMarker,
  SideLineMarker,
  StackedMarkers,
} from "./TimelineMarkers"
import { MobileDrawerTop } from "./MobileDrawerTop"

// TODO: icons for all timeline event types
type TimelineProps = {
  timeline: TimelineType
  className?: string
  onEventInteraction?: (event: TimelineEvent) => void
  onEventClick?: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
}

export function Timeline({
  timeline,
  className = "",
  onEventInteraction,
  onEventClick,
}: TimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null)
  const [popupPosition, setPopupPosition] = useState({
    x: 0,
    y: 0,
    showBelow: false,
  })
  const [drawerEvent, setDrawerEvent] = useState<TimelineEvent | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Close popup on scroll
  useEffect(() => {
    if (!hoveredEvent) return

    const handleScroll = () => {
      setHoveredEvent(null)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hoveredEvent])

  const events = timeline.sort((a, b) => a.year - b.year)

  // Check for large gap (18 years) between first and second event
  const hasLargeGap =
    events.length >= 2 && events[1]!.year - events[0]!.year >= 18
  const sideLineEvent = hasLargeGap ? events[0] : null
  const timelineEvents = hasLargeGap ? events.slice(1) : events

  const firstEventYear = timelineEvents[0]?.year ?? 0
  const lastEventYear = timelineEvents[timelineEvents.length - 1]?.year ?? 0
  const timelineMagnitude = lastEventYear - firstEventYear

  const startYear = firstEventYear - 1
  // For short timelines (< 6 years), use 1 year extension; otherwise use 3 years
  const endExtension = timelineMagnitude < 6 ? 1 : 3
  const endYear = lastEventYear + endExtension
  const totalYears = endYear - startYear

  // Group timeline events by year (excluding side line event)
  const eventsByYear = timelineEvents.reduce(
    (acc, event) => {
      acc[event.year] ??= []
      acc[event.year]!.push(event)
      return acc
    },
    {} as Record<number, TimelineEvent[]>,
  )

  const getEventPosition = (year: number) => {
    return ((year - startYear) / totalYears) * 100
  }

  const handleEventHover = (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => {
    // Only show hover popups on desktop (md breakpoint and above)
    if (window.innerWidth < 768) return

    setHoveredEvent(event)

    // Smart popup positioning to keep it within viewport
    const popupWidth = 320 // Approximate width of max-w-sm (20rem = 320px)
    const popupHeight = 150 // Approximate height
    const padding = 16 // Minimum distance from viewport edges

    const viewportWidth = window.innerWidth

    // Calculate horizontal position
    let x = clientX
    if (x + popupWidth / 2 > viewportWidth - padding) {
      // Too far right, anchor to right edge
      x = viewportWidth - popupWidth / 2 - padding
    } else if (x - popupWidth / 2 < padding) {
      // Too far left, anchor to left edge
      x = popupWidth / 2 + padding
    }

    // Calculate vertical position
    let y = clientY - 10
    let showBelow = false

    // Check if popup would be cut off at the top of viewport
    if (y - popupHeight < padding) {
      // Not enough space above, show below the marker instead
      y = clientY + 40 // Show below marker
      showBelow = true
    }

    setPopupPosition({ x, y, showBelow })

    // Call the optional callback for external interactions (like map panning)
    if (onEventInteraction) {
      onEventInteraction(event)
    }
  }

  const handleEventClick = (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => {
    // On mobile, show drawer on click instead of popup
    if (window.innerWidth < 768) {
      setDrawerEvent(event)
      setIsDrawerOpen(true)
    }

    // Call the optional callback for click interactions (like scrolling and map panning)
    if (onEventClick) {
      onEventClick(event)
    }
  }

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setDrawerEvent(null)
  }

  // Calculate padding needed above and below timeline to prevent overflow
  const { topPadding, bottomPadding } = Object.entries(eventsByYear).reduce(
    (acc, [_year, yearEvents], yearIndex) => {
      const isInverted = yearIndex % 2 === 1

      if (isInverted) {
        // Inverted markers extend below timeline
        if (yearEvents.length > 1) {
          // Inverted stacked markers: 16px initial + 32px per event + 34px for year label
          const stackExtension = 16 + yearEvents.length * 32 + 34
          acc.bottomPadding = Math.max(acc.bottomPadding, stackExtension)
        } else {
          // Single inverted marker: 16px initial + 32px marker + 34px for labels
          acc.bottomPadding = Math.max(acc.bottomPadding, 82)
        }
      } else {
        // Normal markers extend above timeline
        if (yearEvents.length > 1) {
          // Stacked markers: 40px base + 32px per additional event + 24px for year label
          const stackExtension = 40 + (yearEvents.length - 1) * 32 + 24
          acc.topPadding = Math.max(acc.topPadding, stackExtension)
        } else {
          // Single normal marker: 40px base + 32px for potential text wrapping
          acc.topPadding = Math.max(acc.topPadding, 72)
        }
      }

      return acc
    },
    { topPadding: 64, bottomPadding: 48 }, // Minimum padding for basic timeline
  )

  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        paddingTop: `${topPadding}px`,
        paddingBottom: `${bottomPadding}px`,
      }}
    >
      {/* Side line event (if there's a large gap after first event, ie birth and then nothing for a while) */}
      {sideLineEvent && (
        <div
          className="absolute left-0 -translate-y-1/2"
          style={{ top: `${topPadding + 4}px` }}
        >
          <SideLineMarker
            event={sideLineEvent}
            onEventInteraction={handleEventHover}
            onEventClick={handleEventClick}
            onEventLeave={handleEventLeave}
          />
        </div>
      )}

      {/* Timeline axis */}
      <div
        className={`relative h-2 rounded-full bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 ${
          className?.includes("timeline-in-map")
            ? sideLineEvent
              ? "mr-0 ml-10"
              : "mx-0" // Left margin for sideline, no right margin in map context
            : sideLineEvent
              ? "mr-2 ml-10 md:mr-24"
              : "mr-2 md:mr-24" // Normal margins for standalone
        }`}
      >
        {/* Events */}
        {Object.entries(eventsByYear).map(([year, yearEvents], yearIndex) => {
          const position = getEventPosition(Number(year))
          const isMultipleEvents = yearEvents.length > 1

          // Simple alternating pattern for all markers (normal and stacked)
          const isInverted = yearIndex % 2 === 1

          return (
            <div
              key={year}
              className={`absolute -translate-x-1/2 transform ${isInverted ? "top-4" : "-top-10"}`}
              style={{ left: `${position}%` }} // Dynamic positioning required
            >
              {isMultipleEvents ? (
                isInverted ? (
                  <InvertedStackedMarkers
                    year={Number(year)}
                    events={yearEvents}
                    onEventInteraction={handleEventHover}
                    onEventClick={handleEventClick}
                    onEventLeave={handleEventLeave}
                  />
                ) : (
                  <StackedMarkers
                    year={Number(year)}
                    events={yearEvents}
                    onEventInteraction={handleEventHover}
                    onEventClick={handleEventClick}
                    onEventLeave={handleEventLeave}
                  />
                )
              ) : isInverted ? (
                <InvertedMarker
                  year={Number(year)}
                  event={yearEvents[0]!}
                  onEventInteraction={handleEventHover}
                  onEventClick={handleEventClick}
                  onEventLeave={handleEventLeave}
                />
              ) : (
                <NormalMarker
                  year={Number(year)}
                  event={yearEvents[0]!}
                  onEventInteraction={handleEventHover}
                  onEventClick={handleEventClick}
                  onEventLeave={handleEventLeave}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Info popup */}
      {hoveredEvent && (
        <div
          className={`z-modal pointer-events-none fixed max-w-sm min-w-72 -translate-x-1/2 transform rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-xl ${
            popupPosition.showBelow ? "translate-y-2" : "-translate-y-full"
          }`}
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
          }} // Dynamic popup positioning
        >
          <div className="relative">
            {/* Icon in top right corner */}
            {getEventIcon(hoveredEvent.kind, "text-gray-500") && (
              <div className="absolute -top-1 -right-1">
                {getEventIcon(hoveredEvent.kind, "text-gray-500")}
              </div>
            )}

            <div className="mb-2 pr-8 text-sm font-semibold text-amber-400">
              {hoveredEvent.name} ({formatYear(hoveredEvent.year)})
            </div>
            {hoveredEvent.description && (
              <div className="text-sm leading-relaxed text-slate-300">
                {hoveredEvent.description}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawerTop
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        icon={
          drawerEvent
            ? getEventIcon(drawerEvent.kind, "text-gray-500")
            : undefined
        }
      >
        {drawerEvent && (
          <div className="relative">
            {/* Event title with year */}
            <div className="mb-3 text-lg font-semibold text-amber-400">
              {drawerEvent.name} ({formatYear(drawerEvent.year)})
            </div>

            {/* Description - matching popup styling */}
            {drawerEvent.description && (
              <div className="text-base leading-relaxed text-slate-300">
                {drawerEvent.description}
              </div>
            )}
          </div>
        )}
      </MobileDrawerTop>
    </div>
  )
}

// Helper function to get icon component for event kinds
function getEventIcon(
  kind: EventKind,
  colorClass: string,
): React.JSX.Element | null {
  // CSS filter values to match brighter Tailwind colors
  const colorFilters: Record<string, string> = {
    "text-gray-400":
      "brightness(0) saturate(100%) invert(80%) sepia(5%) saturate(300%) hue-rotate(201deg) brightness(130%) contrast(110%)", // much brighter gray-200
    "text-gray-500":
      "brightness(0) saturate(100%) invert(75%) sepia(8%) saturate(320%) hue-rotate(201deg) brightness(120%) contrast(105%)", // brighter gray-400
    "text-blue-300":
      "brightness(0) saturate(100%) invert(90%) sepia(80%) saturate(350%) hue-rotate(176deg) brightness(140%) contrast(120%)", // much brighter blue-100
    "text-amber-400":
      "brightness(0) saturate(100%) invert(85%) sepia(80%) saturate(2000%) hue-rotate(8deg) brightness(110%) contrast(100%)", // amber-400
  }

  const filterStyle = colorFilters[colorClass] ?? colorFilters["text-gray-400"]!

  switch (kind) {
    case "military":
      return (
        <Image
          src="/assets/icon-gladius.png"
          alt="Military event"
          width={22}
          height={22}
          className="h-5 w-5"
          style={{ filter: filterStyle }}
        />
      )
    case "made-emperor":
      return (
        <Image
          src="/assets/icon-laurel.png"
          alt="Made emperor"
          width={24}
          height={24}
          className="h-6 w-6"
          style={{ filter: filterStyle, transform: "translateY(1px)" }}
        />
      )
    case "coin-minted":
      return (
        <Image
          src="/assets/icon-torch.png"
          alt="Coin minted"
          width={22}
          height={22}
          className="h-5 w-5"
          style={{ filter: filterStyle }}
        />
      )
    default:
      return null
  }
}
