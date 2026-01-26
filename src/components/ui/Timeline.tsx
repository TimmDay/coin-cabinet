import Image from "next/image"
import { useState } from "react"
import type {
  EventKind,
  Event as TimelineEvent,
  Timeline as TimelineType,
} from "../../data/timelines/types"
import { MobileTimelineDrawer } from "./MobileTimelineDrawer"
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
  onEventClick?: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  selectedEventIndex?: number
}

export function Timeline({
  timeline,
  className = "",
  onEventClick,
  selectedEventIndex,
}: TimelineProps) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const events = timeline.sort((a, b) => a.year - b.year)

  // Check for large gap (12 years) between first and second event
  const hasLargeGap =
    events.length >= 2 && events[1]!.year - events[0]!.year >= 12
  const sideLineEvent = hasLargeGap ? events[0] : null

  // Check if the last event is a death event for sideline end marker
  const lastEvent = events[events.length - 1]
  const hasDeathAtEnd = lastEvent?.kind === "death"
  const sideLineEndEvent = hasDeathAtEnd ? lastEvent : null

  // Remove sideline events from main timeline
  let timelineEvents = events
  if (hasLargeGap) timelineEvents = timelineEvents.slice(1)
  if (hasDeathAtEnd) timelineEvents = timelineEvents.slice(0, -1)

  // Create a chronologically ordered flat list of all events for keyboard navigation
  const allEventsChronological = events.flatMap((event) => event)

  // Helper function to check if an event is selected
  const isEventSelected = (event: TimelineEvent): boolean => {
    if (selectedEventIndex === undefined) return false
    const eventIndex = allEventsChronological.findIndex(
      (e) => e.name === event.name && e.year === event.year,
    )
    return eventIndex === selectedEventIndex
  }

  // Function to get tab index for an event based on chronological order
  const getEventTabIndex = (event: TimelineEvent): number => {
    const index = allEventsChronological.findIndex(
      (e) => e.name === event.name && e.year === event.year,
    )
    return index + 1 // Start from 1 for better accessibility
  }

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

  const handleEventClick = (event: TimelineEvent) => {
    // Show drawer on click for mobile and tablet (below lg breakpoint: 1024px)
    if (window.innerWidth < 1024) {
      // Find the event index in chronological order
      const eventIndex = allEventsChronological.findIndex(
        (e) => e.name === event.name && e.year === event.year,
      )
      if (eventIndex !== -1) {
        setCurrentEventIndex(eventIndex)
        setIsDrawerOpen(true)
      }
    }

    // Call the optional callback for click interactions (like scrolling and map panning)
    if (onEventClick) {
      onEventClick(event)
    }
  }

  const handleEventKeyDown = (event: TimelineEvent, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      // Trigger the same behavior as click
      handleEventClick(event)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()

      // Find current event index in chronological order
      const currentIndex = allEventsChronological.findIndex(
        (evt) => evt.name === event.name && evt.year === event.year,
      )

      if (currentIndex !== -1) {
        let nextIndex: number

        if (e.key === "ArrowLeft") {
          // Move to previous event (or wrap to last)
          nextIndex =
            currentIndex > 0
              ? currentIndex - 1
              : allEventsChronological.length - 1
        } else {
          // Move to next event (or wrap to first)
          nextIndex =
            currentIndex < allEventsChronological.length - 1
              ? currentIndex + 1
              : 0
        }

        const nextEvent = allEventsChronological[nextIndex]
        if (nextEvent) {
          // Find the element with the corresponding tabIndex and focus it
          const targetElement = document.querySelector(
            `[tabindex="${nextIndex + 1}"]`,
          ) as HTMLElement
          if (targetElement) {
            targetElement.focus()
          }
        }
      }
    }
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  // Handle navigation between events in the mobile drawer
  const handleEventChange = (event: TimelineEvent, index: number) => {
    setCurrentEventIndex(index)

    // Trigger the same interactions as clicking the event marker
    if (onEventClick) {
      onEventClick(event)
    }
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
            onEventClick={handleEventClick}
            onEventKeyDown={handleEventKeyDown}
            tabIndex={getEventTabIndex(sideLineEvent)}
            isSelected={isEventSelected(sideLineEvent)}
          />
        </div>
      )}

      {/* Timeline axis */}
      <div
        className={`relative h-2 rounded-full bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 ${
          className?.includes("timeline-in-map")
            ? sideLineEvent
              ? sideLineEndEvent
                ? "mx-10" // Both sideline markers
                : "mr-0 ml-10" // Only start sideline
              : sideLineEndEvent
                ? "mr-10 ml-0" // Only end sideline
                : "mx-0" // No sideline markers in map context
            : sideLineEvent
              ? sideLineEndEvent
                ? "mx-10 md:mx-24" // Both sideline markers
                : "mr-2 ml-10 md:mr-24" // Only start sideline
              : sideLineEndEvent
                ? "mr-10 ml-2 md:ml-24" // Only end sideline
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
                    onEventClick={handleEventClick}
                    onEventKeyDown={handleEventKeyDown}
                    getEventTabIndex={getEventTabIndex}
                    selectedEventIndex={selectedEventIndex}
                    allEventsChronological={allEventsChronological}
                  />
                ) : (
                  <StackedMarkers
                    year={Number(year)}
                    events={yearEvents}
                    onEventClick={handleEventClick}
                    onEventKeyDown={handleEventKeyDown}
                    getEventTabIndex={getEventTabIndex}
                    selectedEventIndex={selectedEventIndex}
                    allEventsChronological={allEventsChronological}
                  />
                )
              ) : isInverted ? (
                <InvertedMarker
                  year={Number(year)}
                  event={yearEvents[0]!}
                  onEventClick={handleEventClick}
                  onEventKeyDown={handleEventKeyDown}
                  tabIndex={getEventTabIndex(yearEvents[0]!)}
                  isSelected={isEventSelected(yearEvents[0]!)}
                />
              ) : (
                <NormalMarker
                  year={Number(year)}
                  event={yearEvents[0]!}
                  onEventClick={handleEventClick}
                  onEventKeyDown={handleEventKeyDown}
                  tabIndex={getEventTabIndex(yearEvents[0]!)}
                  isSelected={isEventSelected(yearEvents[0]!)}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Side line end event (if last event is death) */}
      {sideLineEndEvent && (
        <div
          className="absolute right-0 -translate-y-1/2"
          style={{ top: `${topPadding + 4}px` }}
        >
          <SideLineMarker
            event={sideLineEndEvent}
            position="end"
            onEventClick={handleEventClick}
            onEventKeyDown={handleEventKeyDown}
            tabIndex={getEventTabIndex(sideLineEndEvent)}
            isSelected={isEventSelected(sideLineEndEvent)}
          />
        </div>
      )}

      {/* Mobile Timeline Drawer */}
      <MobileTimelineDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        events={allEventsChronological}
        currentEventIndex={currentEventIndex}
        onEventChange={handleEventChange}
        getEventIcon={getEventIcon}
      />
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
