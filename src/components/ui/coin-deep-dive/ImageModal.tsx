"use client"

import { getCldImageUrl } from "next-cloudinary"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { IconButton } from "~/components/ui/IconButton"
import { useDragPan } from "~/hooks/useDragPan"

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
  const pan = useDragPan({
    enabled: isZoomed,
    scale: 3,
    origin: zoomOrigin,
  })
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const largeImageUrl = imageUrl
    ? getCldImageUrl({
        src: imageUrl,
        width: 2400,
        height: 2400,
        crop: {
          type: "pad",
          source: true,
        },
        background: "transparent",
      })
    : undefined

  // Focus the close button on open and hand focus back to the opener on close.
  // Tab stays inside the dialog and Escape closes it.
  useEffect(() => {
    if (!isOpen) return

    const opener = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }

      if (event.key === "Tab") {
        const focusableElements =
          modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )

        if (!focusableElements || focusableElements.length === 0) {
          event.preventDefault()
          return
        }

        const firstElement = focusableElements[0]!
        const lastElement = focusableElements[focusableElements.length - 1]!

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    setIsLoading(true)
    setIsZoomed(false)
    setZoomOrigin({ x: 50, y: 50 })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      opener?.focus()
    }
  }, [isOpen, onClose])

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation() // Prevent closing modal
    if (pan.consumeDrag()) return // The click ended a pan, not a zoom toggle

    if (isZoomed) {
      setIsZoomed(false)
    } else {
      // Zoom in around the click position
      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      setZoomOrigin({ x, y })
      setIsZoomed(true)
    }
  }

  // Close when clicking anywhere that's not the image
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.tagName !== "IMG") {
      onClose()
    }
  }

  const imageCursor = isZoomed
    ? pan.isDragging
      ? "cursor-grabbing"
      : "cursor-grab"
    : "cursor-pointer"

  if (!isOpen || !largeImageUrl) return null

  return (
    <div className="z-modal fixed top-0 right-0 bottom-0 left-0 flex h-screen w-screen items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute top-0 right-0 bottom-0 left-0 h-screen w-screen bg-black/60 backdrop-blur-[2px]"
        onClick={handleContainerClick}
        aria-hidden="true"
      />

      {/* Close Button - Fixed to viewport */}
      <IconButton
        ref={closeButtonRef}
        icon={X}
        onClick={onClose}
        className="fixed top-4 right-4 z-30"
        aria-label="Close image modal"
      />

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
          className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 sm:p-8"
          onClick={handleContainerClick}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-t-moonlight aspect-square h-12 w-12 animate-spin rounded-full border-4 border-transparent">
                <span className="sr-only">Loading image...</span>
              </div>
            </div>
          )}

          <div
            className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          >
            {/* Deliberately a plain <img> rather than next/image. The source
                is already a Cloudinary transform requesting a padded
                2400x2400, so the optimisation this rule asks for is done
                upstream. The element also has no intrinsic size to declare:
                it is constrained to the viewport and then scaled and
                translated by CSS for zoom and pan, which next/image's own
                sizing fights. Converting it would also require adding
                res.cloudinary.com to images.remotePatterns, which this
                project does not configure at all. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={largeImageUrl}
              alt={alt}
              className={`max-h-[95vh] max-w-[95vw] object-contain ${imageCursor} transition-transform duration-300 ease-out sm:max-h-[90vh] sm:max-w-[90vw] ${
                isZoomed ? "scale-300" : "scale-100"
              }`}
              style={{
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                ...(isZoomed && {
                  translate: `${pan.offset.x}px ${pan.offset.y}px`,
                  touchAction: "none",
                  transitionDuration: pan.isDragging ? "0ms" : undefined,
                }),
              }}
              {...(isZoomed ? pan.handlers : {})}
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
