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
 * Hovering previews the note and the pointer can travel onto it; a click pins
 * it open until a click elsewhere, Escape, or another click on the trigger.
 */
export function TooltipLaurel({
  children,
  ariaLabel,
  tooltipId,
  widthClasses = "w-[75vw] sm:w-[20rem]",
}: TooltipLaurelProps) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const showTooltip = hovered || pinned
  const [supportsHover, setSupportsHover] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setHovered(false)
    setPinned(false)
  }, [])

  const handleTriggerClick = useCallback(() => {
    if (pinned) close()
    else setPinned(true)
  }, [pinned, close])

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
        close()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [showTooltip, close])

  useEffect(() => {
    if (!showTooltip || supportsHover) return

    const updateTooltipPosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect()
      const tooltipElement = tooltipRef.current
      if (!triggerRect || !tooltipElement) return

      const isTriggerOutsideViewport =
        triggerRect.bottom <= 0 || triggerRect.top >= window.innerHeight

      if (isTriggerOutsideViewport) {
        close()
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
  }, [showTooltip, supportsHover, close])

  // A square-cornered sheet of warm, slightly dim paper. The grain, lines and
  // darkened edges are the `paper` class on the overlay below.
  const paperClasses =
    "animate-paper-in motion-reduce:animate-none relative overflow-y-auto border border-stone-700/30 bg-[linear-gradient(180deg,rgb(222,211,184)_0%,rgb(205,192,161)_100%)] px-6 py-5 text-center text-[17px] leading-8 text-stone-900 ring-1 ring-amber-950/15"

  // The wrapper owns the position and carries the gap below the trigger as
  // padding, so the pointer is still over the tooltip's subtree while it
  // crosses from the trigger to the note.
  const wrapperClasses = supportsHover
    ? `z-tooltip absolute top-full left-1/2 w-[min(75vw,20rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3 ${widthClasses}`
    : "z-tooltip fixed top-[var(--tooltip-top,calc(env(safe-area-inset-top)+6.5rem))] left-1/2 w-[75vw] max-w-[calc(100vw-2rem)] -translate-x-1/2 sm:w-[20rem]"

  const noteClasses = supportsHover
    ? `${paperClasses} max-h-[min(60vh,24rem)] shadow-[0_14px_30px_rgba(0,0,0,0.4)]`
    : `${paperClasses} max-h-[var(--tooltip-max-height,calc(100dvh-env(safe-area-inset-top)-8rem))] shadow-[0_18px_38px_rgba(0,0,0,0.45)]`

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={supportsHover ? () => setHovered(true) : undefined}
      onMouseLeave={supportsHover ? () => setHovered(false) : undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        onBlur={(e) => {
          if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
            close()
          }
        }}
        className="focus:ring-bronze-light/70 focus:ring-offset-surface cursor-pointer rounded-full transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
          className={wrapperClasses}
          tabIndex={-1}
        >
          <div className={noteClasses}>
            <div className="paper pointer-events-none absolute inset-0 opacity-90" />
            <div
              className={`${kalam.className} relative text-center font-normal tracking-[0.01em] [text-shadow:0_0_0_rgba(0,0,0,0.01)] [&_*]:text-inherit [&_p]:mb-3 [&_p:last-child]:mb-0`}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
