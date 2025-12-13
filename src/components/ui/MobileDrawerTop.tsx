"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

export type MobileDrawerTopProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
  icon?: React.ReactNode
}

export function MobileDrawerTop({
  isOpen,
  onClose,
  children,
  title,
  className = "",
  icon,
}: MobileDrawerTopProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Handle touch events for swipe-to-dismiss (upward swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartY(e.touches[0]!.clientY)
    setDragCurrentY(e.touches[0]!.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentY = e.touches[0]!.clientY
    const deltaY = currentY - dragStartY

    // Only allow upward swipes (negative deltaY)
    if (deltaY < 0) {
      setDragCurrentY(currentY)

      // Apply transform to drawer content
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${deltaY}px)`
        contentRef.current.style.opacity = `${Math.max(0.5, 1 + deltaY / 300)}`
      }
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaY = dragCurrentY - dragStartY

    // If dragged up more than 100px, close the drawer
    if (deltaY < -100) {
      onClose()
    } else {
      // Snap back to original position
      if (contentRef.current) {
        contentRef.current.style.transform = ""
        contentRef.current.style.opacity = ""
      }
    }

    setIsDragging(false)
    setDragStartY(0)
    setDragCurrentY(0)
  }

  // Reset transform when drawer closes
  useEffect(() => {
    if (!isOpen && contentRef.current) {
      contentRef.current.style.transform = ""
      contentRef.current.style.opacity = ""
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      ref={drawerRef}
      className="z-modal fixed inset-0 flex items-start justify-center"
    >
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen && !isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer content - styled to match popup, slides from top */}
      <div
        ref={contentRef}
        className={`relative w-full transform rounded-b-2xl border border-slate-600 bg-slate-800 shadow-xl transition-all duration-300 ease-out ${
          isOpen && !isAnimating
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } ${className}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top section with icon and close button */}
        <div className="relative px-4 pt-6 pb-4">
          {/* Icon - absolute positioned in top left */}
          {icon && (
            <div className="absolute top-4 left-4 scale-125">{icon}</div>
          )}

          {/* Close button - absolute positioned in top right */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-300"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title below icon/close section */}
        {title && (
          <div className="p-6 pb-3">
            <h3 className="text-lg font-semibold text-amber-400">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-8 pb-4">{children}</div>

        {/* Drag handle at bottom */}
        <div className="flex justify-center py-2">
          <div className="h-1 w-12 rounded-full bg-slate-500" />
        </div>
      </div>
    </div>
  )
}
