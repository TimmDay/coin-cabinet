"use client"

import { Info } from "lucide-react"
import { useCallback, useRef, useState } from "react"

type InfoTooltipProps = {
  content: string
  id?: string
}

export function InfoTooltip({
  content,
  id = "info-tooltip",
}: InfoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleTooltipToggle = useCallback(() => {
    setShowTooltip((prev) => !prev)
  }, [])

  return (
    <div className="relative mx-auto lg:mr-0 lg:ml-auto">
      <button
        onClick={handleTooltipToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onBlur={(e) => {
          // Only hide tooltip if focus is not moving to the tooltip content
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            setShowTooltip(false)
          }
        }}
        className="border-line bg-field text-moonlight hover:border-moonlight/50 hover:bg-line/50 hover:text-moonlight-bright focus-visible:ring-moonlight/70 cursor-pointer rounded-full border p-2 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Show additional information"
        aria-expanded={showTooltip}
        aria-describedby={showTooltip ? id : undefined}
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Tooltip Content */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          id={id}
          role="tooltip"
          className="z-tooltip border-line bg-night/95 text-moonlight-bright absolute bottom-full left-1/2 mb-3 w-80 -translate-x-1/2 rounded-lg border p-4 text-sm shadow-lg backdrop-blur-sm sm:w-96 lg:top-1/2 lg:right-full lg:bottom-auto lg:left-auto lg:mr-3 lg:mb-0 lg:w-80 lg:translate-x-0 lg:-translate-y-1/2"
          tabIndex={-1}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="whitespace-pre-line">{content}</div>
        </div>
      )}
    </div>
  )
}
