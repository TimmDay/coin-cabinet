import dynamic from "next/dynamic"
import React, { useState } from "react"
import TimelineInfoBox from "./TimelineInfoBox"

// Dynamically import the Map so it only loads in the modal
const Map = dynamic(() => import("../map/Map"), { ssr: false })

export interface MapAndEventModalProps {
  open: boolean
  onClose: () => void
  events: any[]
  initialEventIndex: number
}

export const MapAndEventModal: React.FC<MapAndEventModalProps> = ({
  open,
  onClose,
  events,
  initialEventIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialEventIndex)
  const activeEvent = events[activeIndex]

  if (!open) return null

  return (
    <div className="bg-opacity-80 fixed inset-0 z-50 flex flex-col bg-black">
      <button
        className="absolute top-4 right-4 z-10 rounded-full bg-slate-800/80 p-2 text-white"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Top half: Map */}
        <div className="relative h-1/2 w-full">
          <Map
            center={
              activeEvent.lat && activeEvent.lng
                ? [activeEvent.lat, activeEvent.lng]
                : undefined
            }
            zoom={6}
            event={activeEvent}
            style={{ height: "100%", width: "100%" }}
            className="h-full w-full"
            onEventChange={setActiveIndex}
            events={events}
            activeEventIndex={activeIndex}
          />
        </div>
        {/* Bottom half: Info */}
        <div className="h-1/2 w-full overflow-y-auto bg-slate-900 p-4">
          <TimelineInfoBox
            event={activeEvent}
            onPrevious={() => setActiveIndex((i) => Math.max(0, i - 1))}
            onNext={() =>
              setActiveIndex((i) => Math.min(events.length - 1, i + 1))
            }
            hasPrevious={activeIndex > 0}
            hasNext={activeIndex < events.length - 1}
            className=""
          />
        </div>
      </div>
    </div>
  )
}

export default MapAndEventModal
