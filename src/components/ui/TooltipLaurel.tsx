"use client"

import Image from "next/image"
import { useCallback, useRef, useState, type ReactNode } from "react"

type TooltipLaurelProps = {
  /** Content to display in the tooltip */
  children: ReactNode
  /** Accessible label for the button */
  ariaLabel: string
  /** Unique ID for the tooltip */
  tooltipId: string
  /** Optional custom width classes (default: "w-80 sm:w-96") */
  widthClasses?: string
}

/**
 * A reusable tooltip component with a laurel wreath icon trigger.
 * Shows content on hover/click with accessible keyboard navigation.
 */
export function TooltipLaurel({
  children,
  ariaLabel,
  tooltipId,
  widthClasses = "w-80 sm:w-96",
}: TooltipLaurelProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleTooltipToggle = useCallback(() => {
    setShowTooltip((prev) => !prev)
  }, [])

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleTooltipToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onBlur={(e) => {
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            setShowTooltip(false)
          }
        }}
        className="cursor-pointer rounded-full transition-all duration-200 hover:scale-110"
        aria-label={ariaLabel}
        aria-expanded={showTooltip ? "true" : "false"}
        aria-describedby={tooltipId}
      >
        <Image
          src="/assets/icon-laurel.png"
          alt="Laurel wreath"
          width={24}
          height={24}
          className="h-6 w-6 opacity-70 brightness-0 invert hover:opacity-100"
        />
      </button>

      {/* Tooltip Content */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`z-tooltip absolute top-full left-1/2 mt-3 -translate-x-1/2 rounded-lg border border-slate-600/50 bg-slate-800/95 p-4 text-sm text-slate-300 shadow-lg backdrop-blur-sm ${widthClasses}`}
          tabIndex={-1}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}
