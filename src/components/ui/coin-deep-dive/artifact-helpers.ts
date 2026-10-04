import type { Artifact } from "~/database/schema-artifacts"
import type { Place } from "~/database/schema-places"

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
