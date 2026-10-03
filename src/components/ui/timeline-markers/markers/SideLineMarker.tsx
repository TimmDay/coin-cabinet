import { formatTimelineYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { SideLineMarkerProps } from "../types"
import { markerBorder } from "../markerBorder"

export function SideLineMarker({
  event,
  position = "start",
  onEventClick,
  onEventKeyDown,
  tabIndex,
  isSelected = false,
}: SideLineMarkerProps) {
  return (
    <div>
      {/* Screen reader only labels - accessible but visually hidden */}
      <span className="sr-only">
        {event.name} - {formatTimelineYear(event.year)}
      </span>

      {/* Year label only - visible */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
        <div className="text-moonlight text-center font-mono text-sm whitespace-nowrap">
          {formatTimelineYear(event.year)}
        </div>
      </div>

      {/* Event marker - gray colored */}
      <div
        className="focus:ring-bronze-light relative cursor-pointer rounded-full focus:ring-2 focus:outline-none"
        onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
        onKeyDown={(e) => onEventKeyDown?.(event, e)}
        tabIndex={tabIndex}
        role="button"
        aria-label={`${event.name} - ${formatTimelineYear(event.year)}`}
      >
        {/* Circle marker - gray theme. It grows toward the outer edge, away
            from the timeline, so the tail below never runs into the line. */}
        <div
          className={`relative transition-transform duration-200 hover:scale-110 ${
            position === "start" ? "origin-right" : "origin-left"
          } ${isSelected ? "scale-[1.3]" : ""}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
            <EventLogo event={event} />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 rounded-full border shadow-lg ${markerBorder(event, isSelected)}`}
            style={{ zIndex: 10 }}
          />
        </div>

        {/* Gray teardrop tail - pointing toward timeline */}
        {position === "start" ? (
          <div className="border-l-moonlight/50 absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent"></div>
        ) : (
          <div className="border-r-moonlight/50 absolute top-1/2 right-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-r-8 border-b-4 border-t-transparent border-b-transparent"></div>
        )}
      </div>
    </div>
  )
}
