import { formatTimelineYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { InvertedStackedMarkersProps } from "../types"
import { markerBorder } from "../markerBorder"

export function InvertedStackedMarkers({
  year,
  events,
  onEventClick,
  onEventKeyDown,
  getEventTabIndex,
  selectedEventIndex,
  allEventsChronological = [],
}: InvertedStackedMarkersProps) {
  return (
    <>
      {/* Year label - at the bottom of the stack */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transform whitespace-nowrap"
        style={{ top: `${8 + (events.length - 1) * 32 + 26}px` }} // Dynamic bottom position
      >
        <div className="text-moonlight text-center font-mono text-sm">
          {formatTimelineYear(year)}
        </div>
      </div>

      {/* Stacked markers - below timeline */}
      {events.map((event, eventIndex) => {
        // Check if this specific event is selected
        const isEventSelected =
          selectedEventIndex !== undefined &&
          selectedEventIndex >= 0 &&
          allEventsChronological.length > selectedEventIndex &&
          allEventsChronological[selectedEventIndex] === event

        return (
          <div key={`${year}-${eventIndex}`}>
            {/* Screen reader only labels - accessible but visually hidden */}
            <span className="sr-only">
              {event.name} - {formatTimelineYear(year)}
            </span>

            {/* Event marker */}
            <div
              className={`focus:ring-bronze-light absolute -translate-x-1/2 transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:outline-none ${
                isEventSelected ? "scale-[1.3]" : ""
              }`}
              style={{ top: `${eventIndex * 32}px`, left: "50%" }} // Stack vertically downward
              onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
              onKeyDown={(e) => onEventKeyDown?.(event, e)}
              tabIndex={getEventTabIndex ? getEventTabIndex(event) : undefined}
              role="button"
              aria-label={`${event.name} - ${formatTimelineYear(year)}`}
            >
              {/* Circle marker */}
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
                  <EventLogo event={event} />
                </div>
                <div
                  className={`pointer-events-none absolute inset-0 rounded-full border shadow-lg ${markerBorder(event, isEventSelected)}`}
                  style={{ zIndex: 10 }}
                />
              </div>

              {/* Inverted teardrop tail - only for top marker, pointing up */}
              {eventIndex === 0 && (
                <div className="border-b-moonlight/50 absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-4 border-b-8 border-l-4 border-r-transparent border-l-transparent"></div>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}
