import type { Artifact } from "~/database/schema-artifacts"
import type { Place } from "~/database/schema-places"

/**
 * Get the effective institution name for an artifact.
 * Prefers the linked place's name, falls back to artifact's institution_name.
 */
export function getArtifactInstitutionName(
  artifact: Artifact,
  places: Place[] | undefined,
): string | null {
  if (artifact.place_id && places) {
    const place = places.find((p) => p.id.toString() === artifact.place_id)
    if (place) {
      return place.name
    }
  }
  return artifact.institution_name
}

/**
 * Get the effective latitude for an artifact.
 * Prefers the linked place's lat, falls back to artifact's lat.
 */
export function getArtifactLat(
  artifact: Artifact,
  places: Place[] | undefined,
): number | null {
  if (artifact.place_id && places) {
    const place = places.find((p) => p.id.toString() === artifact.place_id)
    if (place) {
      return place.lat
    }
  }
  return artifact.lat
}

/**
 * Get the effective longitude for an artifact.
 * Prefers the linked place's lng, falls back to artifact's lng.
 */
export function getArtifactLng(
  artifact: Artifact,
  places: Place[] | undefined,
): number | null {
  if (artifact.place_id && places) {
    const place = places.find((p) => p.id.toString() === artifact.place_id)
    if (place) {
      return place.lng
    }
  }
  return artifact.lng
}

/**
 * Get all effective location data for an artifact at once.
 * More efficient than calling individual functions when you need multiple fields.
 */
export function getArtifactLocationData(
  artifact: Artifact,
  places: Place[] | undefined,
): {
  institutionName: string | null
  lat: number | null
  lng: number | null
} {
  if (artifact.place_id && places) {
    const place = places.find((p) => p.id.toString() === artifact.place_id)
    if (place) {
      return {
        institutionName: place.name,
        lat: place.lat,
        lng: place.lng,
      }
    }
  }
  return {
    institutionName: artifact.institution_name,
    lat: artifact.lat,
    lng: artifact.lng,
  }
}
