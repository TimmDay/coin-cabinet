import { formatTimelineYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { MarkerProps } from "../types"
import { markerBorder } from "../markerBorder"

export function InvertedMarker({
  year,
  event,
  onEventClick,
  onEventKeyDown,
  tabIndex,
  isSelected = false,
}: MarkerProps) {
  return (
    <div key={`${year}-0`}>
      {/* Screen reader only labels - accessible but visually hidden */}
      <span className="sr-only">
        {event.name} - {formatTimelineYear(year)}
      </span>

      {/* Event marker - below timeline */}
      <div
        className={`focus:ring-bronze-light relative transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:outline-none ${
          isSelected ? "scale-[1.3]" : ""
        }`}
        onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
        onKeyDown={(e) => onEventKeyDown?.(event, e)}
        tabIndex={tabIndex}
        role="button"
        aria-label={`${event.name} - ${formatTimelineYear(year)}`}
      >
        {/* Circle marker */}
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
            <EventLogo event={event} />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 rounded-full border shadow-lg ${markerBorder(event, isSelected)}`}
            style={{ zIndex: 10 }}
          />
        </div>

        {/* Inverted teardrop tail - pointing up */}
        <div className="border-b-moonlight/50 absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-4 border-b-8 border-l-4 border-r-transparent border-l-transparent"></div>
      </div>

      {/* Year label only - visible */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 transform">
        <div className="text-moonlight text-center font-mono text-sm whitespace-nowrap">
          {formatTimelineYear(year)}
        </div>
      </div>
    </div>
  )
}
