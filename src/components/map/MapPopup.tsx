"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { MapCard } from "./MapCard"

type MapPopupProps = {
  isVisible: boolean
  onClose: () => void
  position: { x: number; y: number }
  content: {
    title: string
    subtitle?: string
    description?: string
    details?: Array<{
      label: string
      value: string
    }>
    notes?: string
    className?: string
  }
}

export function MapPopup({
  isVisible,
  onClose,
  position,
  content,
}: MapPopupProps) {
  const [mounted, setMounted] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isVisible, onClose])

  if (!mounted || !isVisible) return null

  return createPortal(
    <>
      <style jsx>{`
        .popup-container {
          left: ${position.x}px;
          top: ${position.y}px;
          transform: translate(-50%, -100%);
          margin-top: -8px;
        }
        .popup-arrow {
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
        }
      `}</style>
      <div
        ref={popupRef}
        className="popup-container fixed z-[1000] max-w-xs rounded-lg bg-white shadow-lg"
      >
        {/* Arrow pointing down */}
        <div className="popup-arrow absolute top-full left-1/2 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-t-white border-r-transparent border-l-transparent" />

        {/* Content */}
        <MapCard {...content} />
      </div>
    </>,
    document.body,
  )
}
