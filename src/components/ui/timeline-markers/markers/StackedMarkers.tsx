import { formatYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { StackedMarkersProps } from "../types"

export function StackedMarkers({
  year,
  events,
  onEventInteraction,
  onEventClick,
  onEventLeave,
  onEventFocus,
  onEventBlur,
  onEventKeyDown,
  getEventTabIndex,
}: StackedMarkersProps) {
  return (
    <>
      {/* Year label - at the top of the stack */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transform whitespace-nowrap"
        style={{ top: `-${24 + (events.length - 1) * 32}px` }} // Dynamic top position
      >
        <div className="text-center font-mono text-xs text-slate-400">
          {formatYear(year)}
        </div>
      </div>

      {/* Stacked markers */}
      {events.map((event, eventIndex) => (
        <div key={`${year}-${eventIndex}`}>
          {/* Screen reader only labels - accessible but visually hidden */}
          <span className="sr-only">
            {event.name} - {formatYear(year)}
          </span>

          {/* Event marker */}
          <div
            className="absolute -translate-x-1/2 transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            style={{
              top: `${(events.length - 1 - eventIndex) * -32}px`,
              left: "50%",
            }} // Stack vertically, top to bottom order
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

            {/* Teardrop tail - only for bottom marker (closest to timeline) */}
            {eventIndex === events.length - 1 && (
              <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-t-gray-500 border-r-transparent border-l-transparent"></div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
