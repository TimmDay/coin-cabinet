import { MAP_BOUNDS } from "./mapConfig"

/** A position on the map: [latitude, longitude] in degrees. */
export type LatLng = [lat: number, lng: number]

/** Where the map rests when it has been given nothing usable. */
export const ROME: LatLng = [41.9028, 12.4964]

/** A finite number, from a number or a numeric string (the database sends both). */
function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "string" && value.trim() !== "") value = Number(value)
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

/**
 * The position for a latitude and longitude, or `null` when either is missing,
 * not a number, or outside the globe. Zero is a real coordinate.
 */
export function parseLatLng(lat: unknown, lng: unknown): LatLng | null {
  const parsedLat = toFiniteNumber(lat)
  const parsedLng = toFiniteNumber(lng)

  if (parsedLat === null || parsedLng === null) return null
  if (Math.abs(parsedLat) > 90 || Math.abs(parsedLng) > 180) return null

  return [parsedLat, parsedLng]
}

/** True when the position falls inside the area the map covers. */
export function isWithinMapBounds([lat, lng]: LatLng): boolean {
  const [[maxLat, minLng], [minLat, maxLng]] = MAP_BOUNDS.maxBounds

  return lat <= maxLat && lat >= minLat && lng >= minLng && lng <= maxLng
}

/**
 * The position for a latitude and longitude, or `null` unless it is valid and
 * on the map. Use this for anything that gets drawn as a pin.
 */
export function parseMapPosition(lat: unknown, lng: unknown): LatLng | null {
  const position = parseLatLng(lat, lng)
  return position && isWithinMapBounds(position) ? position : null
}

/** A zoom level, or `fallback` when it is missing, not a number, or not above zero. */
export function parseZoom(zoom: unknown, fallback: number): number {
  const parsed = toFiniteNumber(zoom)
  return parsed !== null && parsed > 0 ? parsed : fallback
}
