import { formatTimelineYear } from "~/lib/utils/years"
import { EventLogo } from "../EventLogo"
import type { MarkerProps } from "../types"
import { markerBorder } from "../markerBorder"

export function NormalMarker({
  year,
  event,
  onEventClick,
  onEventKeyDown,
  eventIndex,
  isSelected = false,
}: MarkerProps) {
  return (
    <div key={`${year}-0`}>
      {/* Year label only - visible */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
        <div className="text-moonlight text-center font-mono text-sm whitespace-nowrap">
          {formatTimelineYear(year)}
        </div>
      </div>

      {/* Event marker */}
      <div
        className={`focus:ring-bronze-light relative transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:outline-none ${
          isSelected ? "scale-[1.3]" : ""
        }`}
        onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
        onKeyDown={(e) => onEventKeyDown?.(event, e)}
        tabIndex={0}
        data-event-index={eventIndex}
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

        {/* Normal teardrop tail - pointing down */}
        <div className="border-t-moonlight/50 absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-r-transparent border-l-transparent"></div>
      </div>
    </div>
  )
}
