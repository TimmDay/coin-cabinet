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
          className="flex h-11 w-11 items-center justify-center self-start rounded-md bg-slate-700 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous event"
        >
          <ChevronLeft className="h-4 w-4 text-slate-300" />
        </button>

        <h3 className="pt-1 text-center text-lg leading-tight font-semibold tracking-tight text-slate-200 sm:text-xl">
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
          className="flex h-11 w-11 items-center justify-center self-start justify-self-end rounded-md bg-slate-700 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next event"
        >
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>
      </div>

      {/* Event Details - Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-6">
          <p className="heading-accent text-center text-base font-medium sm:text-lg">
            {formatYear(event.year)}
          </p>
        </div>

        {event.description && (
          <div className="mb-5">
            <p className="text-[15px] leading-8 text-slate-300 sm:text-base">
              {event.description}
            </p>
          </div>
        )}

        {event.place && (
          <div className="mb-4 border-t border-slate-700/70 pt-4">
            <p className="text-sm font-medium tracking-[0.18em] text-slate-500 uppercase">
              Location
            </p>
            <p className="mt-2 text-base text-slate-300">{event.place}</p>
          </div>
        )}
      </div>
    </div>
  )
}
