import Image from "next/image"
import { useEffect, useState } from "react"
import type {
  EventKind,
  Event as TimelineEvent,
  Timeline as TimelineType,
} from "../map/timelines/types"
import {
  InvertedMarker,
  InvertedStackedMarkers,
  NormalMarker,
  SideLineMarker,
  StackedMarkers,
} from "./TimelineMarkers"

// TODO: icons for all timeline event types
type TimelineProps = {
  timeline: TimelineType
  className?: string
  onEventInteraction?: (event: TimelineEvent) => void
}

export function Timeline({
  timeline,
  className = "",
  onEventInteraction,
}: TimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null)
  const [popupPosition, setPopupPosition] = useState({
    x: 0,
    y: 0,
    showBelow: false,
  })

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

  const events = timeline.events.sort((a, b) => a.year - b.year)

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

  const handleEventInteraction = (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => {
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

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  // Calculate the maximum downward extension of inverted stacked markers
  const maxInvertedStackExtension = Object.entries(eventsByYear).reduce(
    (maxExtension, [_year, yearEvents], yearIndex) => {
      const isInverted = yearIndex % 2 === 1
      if (isInverted && yearEvents.length > 1) {
        // For inverted stacked markers:
        // - They start 16px below timeline (top-4)
        // - Each event takes 32px height
        // - Year label is 26px below the last event
        const stackHeight = yearEvents.length * 28
        const totalExtension = 16 + stackHeight // top-4 + stack height
        return Math.max(maxExtension, totalExtension)
      }
      return maxExtension
    },
    0,
  )

  // Add 8px spacing below the lowest inverted marker (only if there are inverted markers)
  const timelineBottomPadding =
    maxInvertedStackExtension > 0 ? maxInvertedStackExtension + 8 : 0

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ paddingBottom: `${timelineBottomPadding}px` }}
    >
      {/* Side line event (if there's a large gap after first event, ie birth and then nothing for a while) */}
      {sideLineEvent && (
        <div
          className="absolute left-0 -translate-y-1/2"
          style={{ top: "4px" }}
        >
          <SideLineMarker
            event={sideLineEvent}
            onEventInteraction={handleEventInteraction}
            onEventLeave={handleEventLeave}
          />
        </div>
      )}

      {/* Timeline axis */}
      <div
        className={`relative mt-16 mb-12 h-2 rounded-full bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 ${sideLineEvent ? "mr-0 ml-10" : "mx-0"}`}
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
                    onEventInteraction={handleEventInteraction}
                    onEventLeave={handleEventLeave}
                  />
                ) : (
                  <StackedMarkers
                    year={Number(year)}
                    events={yearEvents}
                    onEventInteraction={handleEventInteraction}
                    onEventLeave={handleEventLeave}
                  />
                )
              ) : isInverted ? (
                <InvertedMarker
                  year={Number(year)}
                  event={yearEvents[0]!}
                  onEventInteraction={handleEventInteraction}
                  onEventLeave={handleEventLeave}
                />
              ) : (
                <NormalMarker
                  year={Number(year)}
                  event={yearEvents[0]!}
                  onEventInteraction={handleEventInteraction}
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
          className={`pointer-events-none fixed z-50 max-w-sm min-w-72 -translate-x-1/2 transform rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-xl ${
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
              {hoveredEvent.name} ({hoveredEvent.year})
            </div>
            {hoveredEvent.description && (
              <div className="text-sm leading-relaxed text-slate-300">
                {hoveredEvent.description}
              </div>
            )}
          </div>
        </div>
      )}
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
