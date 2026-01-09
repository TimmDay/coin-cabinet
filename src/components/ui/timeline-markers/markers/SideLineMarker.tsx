import { formatTimelineYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { SideLineMarkerProps } from "../types"

export function SideLineMarker({
  event,
  position = "start",
  onEventInteraction,
  onEventClick,
  onEventLeave,
  onEventFocus,
  onEventBlur,
  onEventKeyDown,
  tabIndex,
}: SideLineMarkerProps) {
  return (
    <div>
      {/* Screen reader only labels - accessible but visually hidden */}
      <span className="sr-only">
        {event.name} - {formatTimelineYear(event.year)}
      </span>

      {/* Year label only - visible */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
        <div className="text-center font-mono text-xs whitespace-nowrap text-slate-400">
          {formatTimelineYear(event.year)}
        </div>
      </div>

      {/* Event marker - gray colored */}
      <div
        className="relative transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
        onFocus={(e) => onEventFocus?.(event, e.currentTarget)}
        onBlur={() => onEventBlur?.()}
        onKeyDown={(e) => onEventKeyDown?.(event, e)}
        tabIndex={tabIndex}
        role="button"
        aria-label={`${event.name} - ${formatTimelineYear(event.year)}`}
      >
        {/* Circle marker - gray theme */}
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

        {/* Gray teardrop tail - pointing toward timeline */}
        {position === "start" ? (
          <div className="absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-gray-500"></div>
        ) : (
          <div className="absolute top-1/2 right-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-r-8 border-b-4 border-t-transparent border-r-gray-500 border-b-transparent"></div>
        )}
      </div>
    </div>
  )
}
