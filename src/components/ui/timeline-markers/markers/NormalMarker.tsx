import { formatTimelineYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { MarkerProps } from "../types"

export function NormalMarker({
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

      {/* Year label only - visible */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
        <div className="text-center font-mono text-xs whitespace-nowrap text-slate-400">
          {formatTimelineYear(year)}
        </div>
      </div>

      {/* Event marker */}
      <div
        className={`relative transform cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
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
            className={`pointer-events-none absolute inset-0 rounded-full border shadow-lg ${
              isSelected
                ? "border-2 border-purple-500"
                : event.kind === "coin-minted"
                  ? "border-amber-500"
                  : "border-gray-500"
            }`}
            style={{ zIndex: 10 }}
          />
        </div>

        {/* Normal teardrop tail - pointing down */}
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-4 border-l-4 border-t-gray-500 border-r-transparent border-l-transparent"></div>
      </div>
    </div>
  )
}
