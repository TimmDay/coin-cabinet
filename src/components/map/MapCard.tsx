import React from "react"

type MapCardProps = {
  /** The title/heading of the card */
  title: string
  /** Optional subtitle or secondary information */
  subtitle?: string
  /** Main description or content */
  description?: string
  /** Additional details as key-value pairs */
  details?: Array<{
    label: string
    value: string
  }>
  /** Additional notes or contextual information */
  notes?: string
  /** Custom CSS class for styling variants */
  className?: string
}

/**
 * Reusable card component for map popups and tooltips.
 * Provides consistent styling and structure for displaying information about provinces, time periods, etc.
 */
export const MapCard: React.FC<MapCardProps> = ({
  title,
  subtitle,
  description,
  details = [],
  notes,
  className = "",
}) => {
  return (
    <div className={`min-w-0 p-3 ${className}`}>
      <h4 className="mb-2 text-base font-bold text-amber-800">{title}</h4>

      {subtitle && (
        <p className="mb-2 text-sm text-gray-600">
          <em>{subtitle}</em>
        </p>
      )}

      {description && (
        <p className="mb-2 text-sm text-gray-600">{description}</p>
      )}

      {details.length > 0 && (
        <div className="space-y-1">
          {details.map((detail, index) => (
            <p key={index} className="mb-1">
              <strong>{detail.label}:</strong> {detail.value}
            </p>
          ))}
        </div>
      )}

      {notes && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{notes}</p>
      )}
    </div>
  )
}

/**
 * Helper function to generate HTML string for Leaflet popups using MapCard structure
 */
export const createMapCardHTML = (props: MapCardProps): string => {
  const detailsHTML = props.details?.length
    ? props.details
        .map(
          (detail) =>
            `<p class="mb-1"><strong>${detail.label}:</strong> ${detail.value}</p>`,
        )
        .join("")
    : ""

  return `
    <div class="p-3 min-w-0 ${props.className ?? ""}">
      <h4 class="font-bold text-amber-800 text-base mb-2">
        ${props.title}
      </h4>
      ${props.subtitle ? `<p class="text-sm text-gray-600 mb-2"><em>${props.subtitle}</em></p>` : ""}
      ${props.description ? `<p class="text-sm text-gray-600 mb-2">${props.description}</p>` : ""}
      ${detailsHTML ? `<div class="space-y-1">${detailsHTML}</div>` : ""}
      ${props.notes ? `<p class="text-sm text-gray-600 mt-2 leading-relaxed">${props.notes}</p>` : ""}
    </div>
  `
}
