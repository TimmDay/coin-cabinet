"use client"

import { useState } from "react"
import { ImageCarousel, type CarouselImage } from "./ImageCarousel"

export type Source = {
  quote?: string
  quoteEnglish?: string
  source: string
}

export type DeepDiveCardProps = {
  /** The main title of the card */
  title: string
  /** Subtitle for additional context */
  subtitle?: string
  /** Primary information with historical context */
  primaryInfo?: string
  /** Secondary information */
  secondaryInfo?: string
  /** Image to display underneath secondary info */
  image?: string
  /** Several images to step through, each with its own alt text and caption; wins over `image` */
  images?: CarouselImage[]
  /** Alt text for the image */
  altText?: string
  /** Caption to display under the image */
  caption?: string
  /** Footer text (usually styled greyish) */
  footer?: string
  sources?: Source[]
  /** Additional CSS classes */
  className?: string
  /** Whether the accordion is open by default */
  defaultOpen?: boolean
}

/**
 * DeepDiveCard - A card component for displaying detailed information about gods, symbols, etc.
 * Features an accordion-style info section that can be expanded/collapsed.
 * Designed to be used in a flex layout underneath maps on deep dive pages.
 */
export function DeepDiveCard({
  title,
  subtitle,
  primaryInfo,
  secondaryInfo,
  image,
  images,
  altText,
  caption,
  footer,
  className = "",
  defaultOpen = false,
}: DeepDiveCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Check if there's any content to show in the expandable section
  const pictures: CarouselImage[] = images?.length
    ? images
    : image
      ? [{ src: image, alt: altText || "", caption }]
      : []
  const hasExpandableContent =
    primaryInfo || secondaryInfo || pictures.length > 0

  return (
    // Three rows: header, toggle with its content, footer. Inside the
    // grid in DeepDiveCardsSection they are subgrid rows, shared with the
    // card beside this one, so the chevrons and footers of a row line up with
    // the accordions closed. Anywhere else the three rows just stack.
    <div
      className={`border-line row-span-3 mb-4 grid w-full grid-rows-subgrid overflow-hidden rounded-lg border px-6 pt-6 break-words ${className}`}
    >
      {/* Header Section */}
      <div>
        <h3 className="mb-4 text-center text-xl font-bold tracking-widest uppercase">
          {title}
        </h3>
        {subtitle && (
          <p className="text-moonlight mb-4 text-center text-base whitespace-pre-line">
            {subtitle}
          </p>
        )}
      </div>

      <div>
        {/* Accordion Toggle - only show if there's content to expand */}
        {hasExpandableContent && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-4 flex w-full items-center justify-center rounded text-sm font-medium transition-colors"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Collapse details" : "Expand details"}
          >
            <svg
              className={`text-ink h-6 w-6 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}

        {/* Accordion Content - Info Area */}
        <div
          className={`space-y-4 overflow-hidden pb-4 transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Primary Info */}
          {primaryInfo && (
            <p className="text-moonlight text-center text-base leading-relaxed">
              {primaryInfo}
            </p>
          )}

          {/* Secondary Info */}
          {secondaryInfo && (
            <p className="text-moonlight text-center text-base leading-relaxed">
              {secondaryInfo}
            </p>
          )}

          {/* Image */}
          {pictures.length > 0 && (
            <div className="mt-4">
              <ImageCarousel images={pictures} />
            </div>
          )}
        </div>
      </div>

      {/* Footer (an empty third row when there is none, so rows stay shared) */}
      <div>
        {footer && (
          <div className="border-line flex items-center justify-center border-t pt-5 pb-5">
            <p className="text-moonlight text-center text-sm whitespace-pre-line">
              {footer}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
