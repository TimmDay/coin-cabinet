import Image from "next/image"
import { useState } from "react"
import type { Timeline as TimelineType } from "../map/timelines/types"

// TODO: icons for all timeline event types
type TimelineProps = {
  timeline: TimelineType
  className?: string
}

type TimelineEvent = {
  kind: string
  name: string
  year: number
  description?: string
}

export function Timeline({ timeline, className = "" }: TimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  const events = timeline.events.sort((a, b) => a.year - b.year)

  // Check for large gap (20 years) between first and second event
  const hasLargeGap =
    events.length >= 2 && events[1]!.year - events[0]!.year >= 20
  const sideLineEvent = hasLargeGap ? events[0] : null
  const timelineEvents = hasLargeGap ? events.slice(1) : events

  const startYear = (timelineEvents[0]?.year ?? 0) - 3
  const endYear = (timelineEvents[timelineEvents.length - 1]?.year ?? 0) + 3
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
    setPopupPosition({ x: clientX, y: clientY - 10 })
  }

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Side line event (if there's a large gap after first event, ie birth and then nothing for a while) */}
      {sideLineEvent && (
        <div className="absolute top-1/2 right-full -translate-y-1/2">
          <SideLineMarker
            event={sideLineEvent}
            onEventInteraction={handleEventInteraction}
            onEventLeave={handleEventLeave}
          />
        </div>
      )}

      {/* Timeline axis */}
      <div className="relative mx-4 my-16 h-2 rounded-full bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500">
        {/* Events */}
        {Object.entries(eventsByYear).map(([year, yearEvents], yearIndex) => {
          const position = getEventPosition(Number(year))
          const isMultipleEvents = yearEvents.length > 1

          // Check if previous year had multiple events (stacked marker)
          const yearEntries = Object.entries(eventsByYear)
          const prevYearEntry =
            yearIndex > 0 ? yearEntries[yearIndex - 1] : null
          const prevHadMultipleEvents = prevYearEntry
            ? prevYearEntry[1].length > 1
            : false

          // If this is a single event and previous was stacked, force inverted
          // Otherwise use normal alternating pattern
          const isInverted =
            !isMultipleEvents && (prevHadMultipleEvents || yearIndex % 2 === 1)

          return (
            <div
              key={year}
              className={`absolute -translate-x-1/2 transform ${isInverted ? "top-4" : "-top-10"}`}
              style={{ left: `${position}%` }} // Dynamic positioning required
            >
              {isMultipleEvents ? (
                <StackedMarkers
                  year={Number(year)}
                  events={yearEvents}
                  onEventInteraction={handleEventInteraction}
                  onEventLeave={handleEventLeave}
                />
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
          className="pointer-events-none fixed z-50 max-w-sm -translate-x-1/2 -translate-y-full transform rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-xl"
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

// Marker Components

type MarkerProps = {
  year: number
  event: TimelineEvent
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventLeave: () => void
}

type SideLineMarkerProps = {
  event: TimelineEvent
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventLeave: () => void
}

// Helper function to get icon component for event kinds
function getEventIcon(
  kind: string,
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
    default:
      return null
  }
}

type StackedMarkersProps = {
  year: number
  events: TimelineEvent[]
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventLeave: () => void
}

function NormalMarker({
  year,
  event,
  onEventInteraction,
  onEventLeave,
}: MarkerProps) {
  // Calculate if text will wrap (approximate)
  const textWidth = event.name.length * 6 // rough estimate: 6px per character
  const willWrap = textWidth > 80

  return (
    <div key={`${year}-0`}>
      {/* Year and event name labels */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 transform ${willWrap ? "-top-14" : "-top-10"}`}
      >
        <div className="w-20 space-y-1 text-center">
          <div className="font-mono text-xs whitespace-nowrap text-slate-400">
            {year}
          </div>
          <div className="text-xs font-medium break-words text-slate-400">
            {event.name}
          </div>
        </div>
      </div>

      {/* Event marker */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
      >
        {/* Circle marker */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-transparent shadow-lg"></div>

        {/* Normal teardrop tail - pointing down */}
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-t-gray-500 border-r-transparent border-l-transparent"></div>
      </div>
    </div>
  )
}

function InvertedMarker({
  year,
  event,
  onEventInteraction,
  onEventLeave,
}: MarkerProps) {
  return (
    <div key={`${year}-0`}>
      {/* Event marker - below timeline */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
      >
        {/* Circle marker */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-transparent shadow-lg"></div>

        {/* Inverted teardrop tail - pointing up */}
        <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-4 border-b-8 border-l-4 border-r-transparent border-b-gray-500 border-l-transparent"></div>
      </div>

      {/* Year and event name labels - horizontal */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 transform">
        <div className="w-20 space-y-1 text-center">
          <div className="font-mono text-xs whitespace-nowrap text-slate-400">
            {year}
          </div>
          <div className="text-xs font-medium break-words text-slate-400">
            {event.name}
          </div>
        </div>
      </div>
    </div>
  )
}

function StackedMarkers({
  year,
  events,
  onEventInteraction,
  onEventLeave,
}: StackedMarkersProps) {
  return (
    <>
      {/* Year label - at the top of the stack */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transform whitespace-nowrap"
        style={{ top: `-${24 + (events.length - 1) * 32}px` }} // Dynamic top position
      >
        <div className="text-center font-mono text-xs text-slate-400">
          {year}
        </div>
      </div>

      {/* Stacked markers */}
      {events.map((event, eventIndex) => (
        <div key={`${year}-${eventIndex}`}>
          {/* Event marker */}
          <div
            className="absolute -translate-x-1/2 transform cursor-pointer transition-all duration-200 hover:scale-110"
            style={{ top: `${eventIndex * -32}px`, left: "50%" }} // Stack vertically, no overlap
            onMouseEnter={(e) =>
              onEventInteraction(event, e.clientX, e.clientY)
            }
            onMouseLeave={onEventLeave}
            onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
          >
            {/* Circle marker */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-transparent shadow-lg"></div>

            {/* Teardrop tail - only for bottom marker */}
            {eventIndex === 0 && (
              <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-t-gray-500 border-r-transparent border-l-transparent"></div>
            )}
          </div>

          {/* Event name label - to the right of each circle */}
          <div
            className="absolute transform whitespace-nowrap"
            style={{ top: `${eventIndex * -32 + 8}px`, left: "24px" }} // Center with each circle, moved right 2px
          >
            <div className="text-xs font-medium text-slate-400">
              {event.name}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

function SideLineMarker({
  event,
  onEventInteraction,
  onEventLeave,
}: SideLineMarkerProps) {
  return (
    <div>
      {/* Year and event name labels - horizontal */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform">
        <div className="w-20 space-y-1 text-center">
          <div className="text-xs font-medium break-words text-slate-400">
            {event.name}
          </div>
          <div className="font-mono text-xs whitespace-nowrap text-slate-400">
            {event.year}
          </div>
        </div>
      </div>

      {/* Event marker - gray colored */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventInteraction(event, e.clientX, e.clientY)}
      >
        {/* Circle marker - gray theme */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-transparent shadow-lg"></div>

        {/* Gray teardrop tail - pointing right toward timeline */}
        <div className="absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-gray-500"></div>
      </div>
    </div>
  )
}
