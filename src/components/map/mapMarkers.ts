import { DivIcon } from "leaflet"

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function createReverseTeardropMarkerHtml({
  fillColor,
  borderColor,
  iconSrc,
  active = false,
  sizeScale = 1,
  centerDotScale = 1,
}: {
  fillColor: string
  borderColor: string
  iconSrc?: string
  active?: boolean
  sizeScale?: number
  centerDotScale?: number
}) {
  const size = Math.round((active ? 34 : 30) * sizeScale)
  const safeIconSrc = iconSrc ? escapeHtml(iconSrc) : null
  const iconSize = Math.max(10, Math.round((active ? 18 : 16) * sizeScale))
  const borderWidth = Math.max(2, Math.round((active ? 3 : 2) * sizeScale))
  const containerHeight = size + Math.round(10 * sizeScale)
  const iconTop = Math.round((active ? 11 : 10) * sizeScale)
  const fallbackDotSize = Math.max(
    4,
    Math.round(8 * sizeScale * centerDotScale),
  )

  return `
    <div style="position: relative; width: ${size}px; height: ${containerHeight}px;">
      <div
        style="
          position: absolute;
          left: 50%;
          top: 1px;
          width: ${size}px;
          height: ${size}px;
          transform: translateX(-50%) rotate(-45deg);
          transform-origin: center;
          border-radius: 50% 50% 50% 0;
          background: ${fillColor};
          border: ${borderWidth}px solid ${borderColor};
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.35);
        "
      ></div>
      <div
        style="
          position: absolute;
          left: 50%;
          top: ${iconTop}px;
          width: ${iconSize}px;
          height: ${iconSize}px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        "
      >
        ${
          safeIconSrc
            ? `<img src="${safeIconSrc}" alt="" style="width: ${iconSize}px; height: ${iconSize}px; object-fit: contain; filter: brightness(0) invert(1);" />`
            : `<div style="width: ${fallbackDotSize}px; height: ${fallbackDotSize}px; border-radius: 9999px; background: rgba(255,255,255,0.92);"></div>`
        }
      </div>
    </div>
  `
}

export type CustomMapMarker = {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  description?: string
  className?: string
  fillColor: string
  borderColor: string
  iconSrc?: string
  sizeScale?: number
  centerDotScale?: number
  isActive?: boolean
  showPopup?: boolean
  onClick?: () => void
  zIndexOffset?: number
}

export function createClusterMarkerHtml(count: number) {
  const size = count >= 10 ? 42 : 38

  return `
    <div style="position: relative; width: ${size}px; height: ${size}px;">
      <div
        style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #1e293b 0%, #0f172a 58%, #020617 100%);
          border: 2px solid #9ca3af;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.32), 0 0 0 6px rgba(15, 23, 42, 0.2);
        "
      ></div>
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8fafc;
          font-size: ${count >= 100 ? 11 : 12}px;
          font-weight: 700;
          letter-spacing: 0.02em;
        "
      >${count}</div>
    </div>
  `
}

export function createCustomMarkerIcon(marker: CustomMapMarker): DivIcon {
  const sizeScale = marker.sizeScale ?? 1

  return new DivIcon({
    className: "custom-map-marker",
    html: createReverseTeardropMarkerHtml({
      fillColor: marker.fillColor,
      borderColor: marker.borderColor,
      iconSrc: marker.iconSrc,
      active: marker.isActive,
      sizeScale,
      centerDotScale: marker.centerDotScale,
    }),
    iconSize: marker.isActive
      ? [Math.round(34 * sizeScale), Math.round(44 * sizeScale)]
      : [Math.round(30 * sizeScale), Math.round(40 * sizeScale)],
    iconAnchor: marker.isActive
      ? [Math.round(17 * sizeScale), Math.round(42 * sizeScale)]
      : [Math.round(15 * sizeScale), Math.round(38 * sizeScale)],
  })
}

export function createSpiderfiedMarkerIcon(marker: CustomMapMarker): DivIcon {
  const sizeScale = marker.sizeScale ?? 1

  return new DivIcon({
    className: "custom-map-marker spiderfied-map-marker",
    html: createReverseTeardropMarkerHtml({
      fillColor: marker.fillColor,
      borderColor: marker.borderColor,
      iconSrc: marker.iconSrc,
      active: true,
      sizeScale,
      centerDotScale: marker.centerDotScale,
    }),
    iconSize: [Math.round(34 * sizeScale), Math.round(44 * sizeScale)],
    iconAnchor: [Math.round(17 * sizeScale), Math.round(42 * sizeScale)],
  })
}
