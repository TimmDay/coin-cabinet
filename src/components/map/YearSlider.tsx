"use client"

import { Pause, Play } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { formatYear, SLIDER_END, SLIDER_START } from "./jurisdictions"

/** One year per quarter second, so borders move at a watchable pace. */
const PLAY_INTERVAL_MS = 250

type YearSliderProps = {
  /** The year the map is currently showing. */
  value: number
  onChange: (year: number) => void
  /**
   * Years in which something begins or ends. Drawn as ticks so a visitor can
   * see that long flat stretches genuinely held steady, rather than reading
   * an unmoving map as a broken control.
   */
  changeYears?: number[]
  /** Fits the map to what is currently drawn. Hidden when not supplied. */
  onFitExtent?: () => void
  className?: string
}

/** Where a year sits along the track, 0 to 1. */
function positionOf(year: number): number {
  return (year - SLIDER_START) / (SLIDER_END - SLIDER_START)
}

const DECADE_MARKS = [-200, 1, 300, 600, 900, 1200, 1453]

export function YearSlider({
  value,
  onChange,
  changeYears = [],
  onFitExtent,
  className = "",
}: YearSliderProps) {
  // Ticks crowd where history was busy, which is the point, but duplicates at
  // the same pixel are wasted DOM. Round to a tenth of a percent.
  const [playing, setPlaying] = useState(false)

  // The interval needs the year as it is when it fires, not as it was when the
  // interval was created, and `onChange` takes a value rather than an updater.
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    if (!playing) return

    const id = window.setInterval(() => {
      const next = valueRef.current + 1
      if (next > SLIDER_END) {
        setPlaying(false)
        return
      }
      onChange(next)
    }, PLAY_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [playing, onChange])

  const tickPositions = useMemo(() => {
    const seen = new Set<number>()
    for (const year of changeYears) {
      if (year < SLIDER_START || year > SLIDER_END) continue
      seen.add(Math.round(positionOf(year) * 1000))
    }
    return [...seen].map((thousandth) => thousandth / 10)
  }, [changeYears])

  return (
    <div
      className={`border-paper-edge bg-paper rounded-lg border p-4 shadow-sm ${className}`}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-3">
          <label
            htmlFor="year-slider"
            className="text-paper-ink-muted text-xs tracking-wide uppercase"
          >
            Year
          </label>
          <output
            htmlFor="year-slider"
            className="text-paper-ink font-display text-xl tabular-nums"
          >
            {formatYear(value)}
          </output>
        </div>

        {onFitExtent && (
          <button
            type="button"
            onClick={onFitExtent}
            className="border-paper-edge text-paper-ink-muted hover:text-paper-ink rounded border px-2 py-1 text-xs"
          >
            Fit to extent
          </button>
        )}
      </div>

      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <div className="relative">
            {/* Ticks sit behind the input. The track is inset by roughly half a
            thumb width at each end, so positions are nudged to match. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-3"
            >
              {tickPositions.map((percent) => (
                <span
                  key={percent}
                  className="bg-paper-edge absolute top-0 h-2 w-px"
                  style={{ left: `calc(${percent}% * 0.98 + 1%)` }}
                />
              ))}
            </div>

            <input
              id="year-slider"
              type="range"
              min={SLIDER_START}
              max={SLIDER_END}
              step={1}
              value={value}
              onChange={(event) => {
                // Taking hold of the slider stops playback, as on any player.
                setPlaying(false)
                onChange(Number(event.target.value))
              }}
              className="accent-map-label relative mt-3 w-full cursor-pointer"
              aria-valuetext={formatYear(value)}
            />
          </div>

          <div className="text-paper-ink-muted mt-1 flex justify-between text-[10px] tabular-nums">
            {DECADE_MARKS.map((year) => (
              <span key={year}>{formatYear(year)}</span>
            ))}
          </div>
        </div>

        {/* Filled rather than outlined: a paper-edge border measures 1.84:1
            against the card, short of the 3:1 a control's boundary needs,
            while the filled disc reads at 11.37:1. */}
        <button
          type="button"
          onClick={() => {
            setPlaying((wasPlaying) => {
              if (wasPlaying) return false
              // Pressing play at the end replays from the start.
              if (valueRef.current >= SLIDER_END) onChange(SLIDER_START)
              return true
            })
          }}
          aria-label={playing ? "Pause" : "Play the years forward"}
          className="bg-paper-ink text-paper hover:bg-paper-ink/90 focus-visible:outline-paper-ink mb-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {playing ? (
            <Pause aria-hidden="true" className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play
              aria-hidden="true"
              className="ml-0.5 h-4 w-4"
              fill="currentColor"
            />
          )}
        </button>
      </div>
    </div>
  )
}
