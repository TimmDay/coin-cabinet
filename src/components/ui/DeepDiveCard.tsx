"use client"

import { useState } from "react"

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
  footer,
  className = "",
  defaultOpen = false,
}: DeepDiveCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={`bg-card w-full rounded-lg border border-gray-500 px-6 pt-6 ${className}`}
    >
      {/* Header Section */}
      <h3 className="heading-accent mb-4 text-center text-xl font-bold tracking-widest uppercase">
        {title}
      </h3>
      {subtitle && (
        <p className="mb-4 text-center text-sm whitespace-pre-line text-gray-400 italic">
          {subtitle}
        </p>
      )}

      {/* Accordion Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-muted/50 text-foreground hover:bg-muted mb-4 flex w-full items-center justify-center rounded text-sm font-medium transition-colors"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse details" : "Expand details"}
      >
        <svg
          className={`heading-accent h-6 w-6 transition-transform duration-200 ${
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

      {/* Accordion Content - Info Area */}
      <div
        className={`space-y-4 overflow-hidden pb-4 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Primary Info */}
        {primaryInfo && (
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            {primaryInfo}
          </p>
        )}

        {/* Secondary Info */}
        {secondaryInfo && (
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            {secondaryInfo}
          </p>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-center border-t border-gray-500 pt-5 pb-5">
          <p className="text-center text-xs text-gray-400">{footer}</p>
        </div>
      )}
    </div>
  )
}
