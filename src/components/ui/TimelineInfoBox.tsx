"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatYear } from "~/lib/utils/date-formatting"
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
        <p className="text-slate-400">No event selected</p>
      </div>
    )
  }

  return (
    <div className={`flex h-full flex-col bg-slate-800 p-6 ${className}`}>
      {/* Navigation Controls */}
      <div className="mb-4 flex items-start justify-between">
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
          className="rounded-md bg-slate-700 p-2 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous event"
        >
          <ChevronLeft className="h-4 w-4 text-slate-300" />
        </button>

        <h3 className="mx-4 flex-1 text-center text-lg font-semibold text-slate-400">
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
          className="rounded-md bg-slate-700 p-2 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next event"
        >
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>
      </div>

      {/* Event Details - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <p className="heading-accent text-center font-medium">
            {formatYear(event.year)}
          </p>
        </div>

        {event.description && (
          <div className="mb-4">
            <p className="leading-relaxed text-slate-400">
              {event.description}
            </p>
          </div>
        )}

        {event.place && (
          <div className="mb-4">
            <p className="text-slate-400">{event.place}</p>
          </div>
        )}
      </div>
    </div>
  )
}
