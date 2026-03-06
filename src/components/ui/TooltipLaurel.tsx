"use client"

import { Kalam } from "next/font/google"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

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
  widthClasses = "w-[75vw] sm:w-[20rem]",
}: TooltipLaurelProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [supportsHover, setSupportsHover] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleTooltipToggle = useCallback(() => {
    setShowTooltip((prev) => !prev)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)")

    const updateSupportsHover = () => {
      setSupportsHover(mediaQuery.matches)
    }

    updateSupportsHover()
    mediaQuery.addEventListener("change", updateSupportsHover)

    return () => {
      mediaQuery.removeEventListener("change", updateSupportsHover)
    }
  }, [])

  useEffect(() => {
    if (!showTooltip) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (!containerRef.current?.contains(target)) {
        setShowTooltip(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowTooltip(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [showTooltip])

  useEffect(() => {
    if (!showTooltip || supportsHover) return

    const updateTooltipPosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect()
      const tooltipElement = tooltipRef.current
      if (!triggerRect || !tooltipElement) return

      const isTriggerOutsideViewport =
        triggerRect.bottom <= 0 || triggerRect.top >= window.innerHeight

      if (isTriggerOutsideViewport) {
        setShowTooltip(false)
        return
      }

      const top = Math.max(triggerRect.bottom, 0)
      const maxHeight = Math.max(160, window.innerHeight - top - 16)

      tooltipElement.style.setProperty("--tooltip-top", `${top}px`)
      tooltipElement.style.setProperty("--tooltip-max-height", `${maxHeight}px`)
    }

    updateTooltipPosition()
    window.addEventListener("resize", updateTooltipPosition)
    window.addEventListener("scroll", updateTooltipPosition, true)

    return () => {
      window.removeEventListener("resize", updateTooltipPosition)
      window.removeEventListener("scroll", updateTooltipPosition, true)
    }
  }, [showTooltip, supportsHover])

  const tooltipClasses = supportsHover
    ? `z-tooltip absolute top-full left-1/2 mt-3 max-h-[min(60vh,24rem)] w-[min(75vw,20rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-y-auto rounded-xl border border-stone-700/20 bg-[linear-gradient(180deg,rgba(246,239,220,0.98)_0%,rgba(232,220,194,0.98)_100%)] px-6 py-5 text-center text-[17px] leading-8 text-stone-900 shadow-[0_18px_42px_rgba(0,0,0,0.32)] ring-1 ring-amber-950/10 ${widthClasses}`
    : "z-tooltip fixed top-[var(--tooltip-top,calc(env(safe-area-inset-top)+6.5rem))] left-1/2 max-h-[var(--tooltip-max-height,calc(100dvh-env(safe-area-inset-top)-8rem))] w-[75vw] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-y-auto rounded-xl border border-stone-700/20 bg-[linear-gradient(180deg,rgba(246,239,220,0.99)_0%,rgba(232,220,194,0.99)_100%)] px-6 py-5 text-center text-[17px] leading-8 text-stone-900 shadow-[0_22px_48px_rgba(0,0,0,0.38)] ring-1 ring-amber-950/10 sm:w-[20rem]"

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTooltipToggle}
        onMouseEnter={supportsHover ? () => setShowTooltip(true) : undefined}
        onMouseLeave={supportsHover ? () => setShowTooltip(false) : undefined}
        onBlur={(e) => {
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            setShowTooltip(false)
          }
        }}
        className="cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-amber-400/70 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
        aria-label={ariaLabel}
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
          className={tooltipClasses}
          tabIndex={-1}
          onMouseEnter={supportsHover ? () => setShowTooltip(true) : undefined}
          onMouseLeave={supportsHover ? () => setShowTooltip(false) : undefined}
        >
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_38%),linear-gradient(135deg,rgba(120,72,24,0.05),transparent_45%),repeating-linear-gradient(180deg,rgba(120,72,24,0.045)_0px,rgba(120,72,24,0.045)_1px,transparent_1px,transparent_11px)] opacity-80" />
          <div
            className={`${kalam.className} relative text-center font-normal tracking-[0.01em] [text-shadow:0_0_0_rgba(0,0,0,0.01)] [&_*]:text-inherit [&_p]:mb-3 [&_p:last-child]:mb-0`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
