"use client"

import { getCldImageUrl } from "next-cloudinary"
import { useEffect, useRef, useState } from "react"

type ImageModalProps = {
  isOpen: boolean
  onClose: () => void
  imageUrl?: string
  alt: string
}

export function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
}: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Generate the optimized Cloudinary URL
  const largeImageUrl = imageUrl
    ? getCldImageUrl({
        src: imageUrl,
        width: 800,
        height: 800,
        crop: {
          type: "pad",
          source: true,
        },
        background: "transparent",
      })
    : undefined

  // Handle focus trapping and keyboard events
  useEffect(() => {
    if (!isOpen) return

    // Focus the close button when modal opens
    const focusCloseButton = () => {
      closeButtonRef.current?.focus()
    }

    // Small delay to ensure modal is rendered
    const timeoutId = setTimeout(focusCloseButton, 100)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }

      // Focus trapping
      if (event.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )

        if (!focusableElements || focusableElements.length === 0) {
          event.preventDefault()
          return
        }

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement

        if (event.shiftKey) {
          // Shift + Tab - going backwards
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab - going forwards
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    setIsLoading(true)
    // Reset zoom when modal opens
    setIsZoomed(false)
    setZoomOrigin({ x: 50, y: 50 })

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Handle image click for zoom functionality
  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation() // Prevent closing modal

    if (isZoomed) {
      // If already zoomed, zoom out
      setIsZoomed(false)
    } else {
      // Calculate click position relative to image
      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      setZoomOrigin({ x, y })
      setIsZoomed(true)
    }
  }

  // Handle container click (outside image) to close modal
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the container itself, not its children
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen || !imageUrl) return null

  return (
    <div className="z-modal fixed top-0 right-0 bottom-0 left-0 flex h-screen w-screen items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute top-0 right-0 bottom-0 left-0 h-screen w-screen bg-black/60 backdrop-blur-[2px]"
        onClick={handleContainerClick}
        aria-hidden="true"
      />

      {/* Close Button - Fixed to viewport */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="fixed top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/90 text-white shadow-lg transition-colors hover:bg-slate-700 focus:ring-2 focus:ring-white/50 focus:outline-none sm:h-10 sm:w-10"
        aria-label="Close image modal"
      >
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative z-10 flex h-screen w-screen items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Hidden labels for screen readers */}
        <h2 id="modal-title" className="sr-only">
          Large Image View
        </h2>
        <p id="modal-description" className="sr-only">
          {alt}. Press Escape or click the close button to return to the page.
        </p>

        {/* Large Image with Loading Spinner */}
        <div
          ref={imageContainerRef}
          className="relative flex h-full w-full items-center justify-center overflow-hidden p-2"
          onClick={handleContainerClick}
        >
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="aspect-square h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-slate-300">
                <span className="sr-only">Loading image...</span>
              </div>
            </div>
          )}

          {/* Image */}
          <div
            className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={largeImageUrl}
              alt={alt}
              className={`max-h-full max-w-full cursor-pointer object-contain transition-transform duration-300 ease-out ${
                isZoomed ? "scale-300" : "scale-100"
              }`}
              style={{
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              }}
              onClick={handleImageClick}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
