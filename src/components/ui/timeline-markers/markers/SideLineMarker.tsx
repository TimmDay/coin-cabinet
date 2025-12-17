import { formatYear } from "~/lib/utils/date-formatting"
import { EventLogo } from "../EventLogo"
import type { SideLineMarkerProps } from "../types"

export function SideLineMarker({
  event,
  onEventInteraction,
  onEventClick,
  onEventLeave,
}: SideLineMarkerProps) {
  return (
    <div>
      {/* Screen reader only labels - accessible but visually hidden */}
      <span className="sr-only">
        {event.name} - {formatYear(event.year)}
      </span>

      {/* Year label only - visible */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform">
        <div className="text-center font-mono text-xs whitespace-nowrap text-slate-400">
          {formatYear(event.year)}
        </div>
      </div>

      {/* Event marker - gray colored */}
      <div
        className="relative transform cursor-pointer transition-all duration-200 hover:scale-110"
        onMouseEnter={(e) => onEventInteraction(event, e.clientX, e.clientY)}
        onMouseLeave={onEventLeave}
        onClick={(e) => onEventClick(event, e.clientX, e.clientY)}
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

        {/* Gray teardrop tail - pointing right toward timeline */}
        <div className="absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 transform border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-gray-500"></div>
      </div>
    </div>
  )
}
