"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatYear } from "~/lib/utils/date-formatting"
import { CitationList } from "./CitationList"
import type { Event as TimelineEvent } from "../../data/timelines/types"

type TimelineInfoBoxProps = {
  event: TimelineEvent | null
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
  className?: string
}

export function TimelineInfoBox({
  event,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  className = "",
}: TimelineInfoBoxProps) {
  if (!event) {
    return (
      <div
        className={`flex h-full flex-col items-center justify-center p-6 ${className}`}
      >
        <p className="text-moonlight">No event selected</p>
      </div>
    )
  }

  return (
    <div
      className={`border-line bg-night flex h-full flex-col border-l p-6 ${className}`}
    >
      {/* Navigation Controls */}
      <div className="mt-3 mb-7 grid grid-cols-[44px_minmax(0,1fr)_44px] items-start gap-3">
        <button
          onClick={onPrevious}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              e.stopPropagation()
              onPrevious()
            }
          }}
          disabled={!hasPrevious}
          className="border-line bg-field hover:bg-surface-raised flex h-11 w-11 items-center justify-center self-start rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous event"
        >
          <ChevronLeft className="text-moonlight h-4 w-4" />
        </button>

        <h3 className="font-display text-moonlight-bright pt-1 text-center text-lg leading-tight font-medium tracking-[0.12em] uppercase sm:text-xl">
          {event.name}
        </h3>

        <button
          onClick={onNext}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              e.stopPropagation()
              onNext()
            }
          }}
          disabled={!hasNext}
          className="border-line bg-field hover:bg-surface-raised flex h-11 w-11 items-center justify-center self-start justify-self-end rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next event"
        >
          <ChevronRight className="text-moonlight h-4 w-4" />
        </button>
      </div>

      {/* Event Details - Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-6">
          <p className="font-display text-bronze-light text-center text-base tracking-[0.12em] sm:text-lg">
            {formatYear(event.year)}
            {event.place && `, ${event.place}`}
          </p>
        </div>

        {event.description && (
          <div className="mb-5">
            <p className="text-moonlight text-base leading-8 tracking-[0.01em]">
              {event.description}
            </p>
          </div>
        )}

        <CitationList citations={event.citations} />
      </div>
    </div>
  )
}
