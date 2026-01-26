"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { formatYear } from "~/lib/utils/date-formatting"
import type { Event as TimelineEvent } from "../../data/timelines/types"

export type MobileTimelineDrawerProps = {
  isOpen: boolean
  onClose: () => void
  events: TimelineEvent[]
  currentEventIndex: number
  onEventChange: (event: TimelineEvent, index: number) => void
  className?: string
  getEventIcon?: (
    kind: TimelineEvent["kind"],
    colorClass: string,
  ) => React.ReactNode
}

export function MobileTimelineDrawer({
  isOpen,
  onClose,
  events,
  currentEventIndex,
  onEventChange,
  className = "",
}: MobileTimelineDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentX, setDragCurrentX] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [dragDirection, setDragDirection] = useState<
    "horizontal" | "vertical" | null
  >(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const currentEvent = events[currentEventIndex]

  // Handle drawer opening/closing animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsAnimating(true)
      // Small delay to ensure the element is rendered before animating
      const timer = setTimeout(() => setIsAnimating(false), 50)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsAnimating(false)
      }, 300) // Match transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Navigation functions
  const goToPrevEvent = () => {
    const newIndex =
      currentEventIndex > 0 ? currentEventIndex - 1 : events.length - 1
    onEventChange(events[newIndex]!, newIndex)
  }

  const goToNextEvent = () => {
    const newIndex =
      currentEventIndex < events.length - 1 ? currentEventIndex + 1 : 0
    onEventChange(events[newIndex]!, newIndex)
  }

  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartX(e.touches[0]!.clientX)
    setDragStartY(e.touches[0]!.clientY)
    setDragCurrentX(e.touches[0]!.clientX)
    setDragCurrentY(e.touches[0]!.clientY)
    setDragDirection(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0]!.clientX
    const currentY = e.touches[0]!.clientY
    const deltaX = currentX - dragStartX
    const deltaY = currentY - dragStartY

    setDragCurrentX(currentX)
    setDragCurrentY(currentY)

    // Determine drag direction if not already set
    if (!dragDirection) {
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX > absY && absX > 10) {
        setDragDirection("horizontal")
      } else if (absY > absX && absY > 10) {
        setDragDirection("vertical")
      }
    }

    // Apply transform based on drag direction
    if (contentRef.current) {
      if (dragDirection === "vertical" && deltaY < 0) {
        // Vertical upward swipe - dismiss gesture
        contentRef.current.style.transform = `translateY(${deltaY}px)`
        contentRef.current.style.opacity = `${Math.max(0.5, 1 + deltaY / 300)}`
      } else if (dragDirection === "horizontal") {
        // Horizontal swipe - navigation gesture
        // Visual feedback for horizontal swipe
        const maxTransform = 50
        const clampedDelta = Math.max(
          -maxTransform,
          Math.min(maxTransform, deltaX * 0.3),
        )
        contentRef.current.style.transform = `translateX(${clampedDelta}px)`
        contentRef.current.style.opacity = `${Math.max(0.8, 1 - Math.abs(deltaX) / 400)}`
      }
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaX = dragCurrentX - dragStartX
    const deltaY = dragCurrentY - dragStartY

    if (dragDirection === "vertical" && deltaY < -100) {
      // Upward swipe > 100px - close drawer
      onClose()
    } else if (dragDirection === "horizontal") {
      // Horizontal swipe - navigate between events
      const swipeThreshold = 80

      if (deltaX > swipeThreshold) {
        // Swipe right - previous event
        goToPrevEvent()
      } else if (deltaX < -swipeThreshold) {
        // Swipe left - next event
        goToNextEvent()
      }
    }

    // Reset transform
    if (contentRef.current) {
      contentRef.current.style.transform = ""
      contentRef.current.style.opacity = ""
    }

    setIsDragging(false)
    setDragStartX(0)
    setDragStartY(0)
    setDragCurrentX(0)
    setDragCurrentY(0)
    setDragDirection(null)
  }

  // Reset transform when drawer closes or event changes
  useEffect(() => {
    if (contentRef.current && (!isOpen || !isDragging)) {
      contentRef.current.style.transform = ""
      contentRef.current.style.opacity = ""
    }
  }, [isOpen, currentEventIndex, isDragging])

  if (!isVisible || !currentEvent) return null

  // Chevrons are always enabled since we wrap around
  const hasPrevEvent = true
  const hasNextEvent = true

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === drawerRef.current) {
      onClose()
    }
  }

  return (
    <div
      ref={drawerRef}
      className="z-modal fixed inset-0 flex items-start justify-center"
      onClick={handleBackdropClick}
    >
      {/* No background overlay - map stays fully visible */}

      {/* Drawer content */}
      <div
        ref={contentRef}
        className={`relative flex w-full flex-col rounded-b-2xl border border-slate-600 bg-slate-800/95 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out ${
          isOpen && !isAnimating
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } ${className}`}
        style={{ height: "320px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fixed header with navigation and close button */}
        <div className="flex-shrink-0">
          {/* Top section with chevron navigation */}
          <div className="relative flex items-center justify-between px-4 py-3">
            {/* Left chevron */}
            <button
              onClick={goToPrevEvent}
              disabled={!hasPrevEvent}
              className={`rounded-full p-2 transition-colors ${
                hasPrevEvent
                  ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "cursor-not-allowed text-slate-600"
              }`}
              aria-label="Previous event"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Event counter in center */}
            <div className="text-xs text-slate-400">
              {currentEventIndex + 1} of {events.length}
            </div>

            {/* Right chevron */}
            <button
              onClick={goToNextEvent}
              disabled={!hasNextEvent}
              className={`rounded-full p-2 transition-colors ${
                hasNextEvent
                  ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "cursor-not-allowed text-slate-600"
              }`}
              aria-label="Next event"
            >
              <ChevronRight size={24} />
            </button>

            {/* Close button - absolute positioned */}
            <button
              onClick={onClose}
              className="absolute top-1 right-1 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-300"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable event content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Event title with year */}
          <div className="mb-3 text-lg font-semibold text-amber-400">
            {currentEvent.name} ({formatYear(currentEvent.year)})
          </div>

          {/* Description */}
          {currentEvent.description && (
            <div className="text-base leading-relaxed text-slate-300">
              {currentEvent.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
