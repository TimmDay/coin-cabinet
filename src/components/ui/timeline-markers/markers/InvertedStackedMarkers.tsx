import { formatYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { InvertedStackedMarkersProps } from "../types"

export function InvertedStackedMarkers({
  year,
  events,
  onEventInteraction,
  onEventClick,
  onEventLeave,
  onEventFocus,
  onEventBlur,
  onEventKeyDown,
  getEventTabIndex,
}: InvertedStackedMarkersProps) {
  return (
    <>
      {/* Year label - at the bottom of the stack */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transform whitespace-nowrap"
        style={{ top: `${8 + (events.length - 1) * 32 + 26}px` }} // Dynamic bottom position
      >
        <div className="text-center font-mono text-xs text-slate-400">
          {formatYear(year)}
        </div>
      </div>

      {/* Stacked markers - below timeline */}
      {events.map((event, eventIndex) => (
        <div key={`${year}-${eventIndex}`}>
          {/* Screen reader only labels - accessible but visually hidden */}
          <span className="sr-only">
            {event.name} - {formatYear(year)}
          </span>

          {/* Event marker */}
          <div
            className="absolute -translate-x-1/2 transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            style={{ top: `${eventIndex * 32}px`, left: "50%" }} // Stack vertically downward
            onMouseEnter={(e) =>
              onEventInteraction(event, e.clientX, e.clientY)
            }
            onMouseLeave={onEventLeave}
            onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
            onFocus={(e) => onEventFocus?.(event, e.currentTarget)}
            onBlur={() => onEventBlur?.()}
            onKeyDown={(e) => onEventKeyDown?.(event, e)}
            tabIndex={getEventTabIndex ? getEventTabIndex(event) : undefined}
            role="button"
            aria-label={`${event.name} - ${formatYear(year)}`}
          >
            {/* Circle marker */}
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
                <EventLogo event={event} />
              </div>
              <div
                className={`pointer-events-none absolute inset-0 rounded-full border shadow-lg ${
                  event.kind === "coin-minted"
                    ? "border-amber-500"
                    : "border-gray-500"
                }`}
                style={{ zIndex: 10 }}
              />
            </div>

            {/* Inverted teardrop tail - only for top marker, pointing up */}
            {eventIndex === 0 && (
              <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-4 border-b-8 border-l-4 border-r-transparent border-b-gray-500 border-l-transparent"></div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
