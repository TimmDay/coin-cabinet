import { COIN_PAGE_TIER, type Tier } from "./jurisdictions"
import { DEEP_DIVE_MAP_VIEW } from "./mapConfig"

/** Where a coin's deep-dive map opens: [lat, lng] centre, zoom, and the Jurisdiction tier. */
export type DeepDiveMapView = {
  center: [number, number]
  zoom: number
  tier: Tier
}

// Places a map can open on, as [lat, lng]
const JERUSALEM: [number, number] = [31.7683, 35.2137]
const CARTHAGE: [number, number] = [36.8528, 10.3233]
const CONSTANTINOPLE: [number, number] = [41.0082, 28.9784]
const CTESIPHON: [number, number] = [33.0937, 44.581]
const ATHENS: [number, number] = [37.9838, 23.7275]
// Colonia Agrippina (Cologne), the Gallic Empire's capital under Postumus
const COLONIA_AGRIPPINA: [number, number] = [50.9375, 6.9603]
const PALMYRA: [number, number] = [34.5505, 38.2692]

/**
 * As close in as the map can go while the admin areas are still labelled. The
 * ancient overlay fades out between zoom 6 and 7 (OVERLAY_FADE_ZOOM) and the
 * names are gone from 7 up, so 6.5 keeps the names with the shading and
 * outlines still at about half strength.
 */
export const ADMIN_LABEL_ZOOM = 6.5

/**
 * The first year the map has any admin areas (Italia, from 275 BCE). Before
 * it the Admin areas tier is empty, so a coin that long ago opens on Realms.
 * Kept in step with the data by a test.
 */
export const FIRST_ADMIN_AREAS_YEAR = -275

// MapLibre zoom: each step doubles the scale, and 3 is as far out as the map goes.

/**
 * A little closer than the default, with the whole Gallic Empire (Britain to
 * the Pyrenees, about 13 degrees from south to north and 13 across) still in
 * view on the smallest map the coin page draws, a phone's 350px by 400px. From
 * Colonia Agrippina the empire's western edge is the limit there, at about
 * zoom 3.16. A desktop map would fit it up to about 3.7.
 */
const GALLIC_EMPIRE_ZOOM = 3.15
/** A little closer than the default, without losing the Roman and Persian worlds around Palmyra. */
const PALMYRENE_EMPIRE_ZOOM = 3.5

/** The default: as far out as the map goes, over the heel of Italy, on Realms. */
const DEFAULT_VIEW: DeepDiveMapView = {
  center: DEEP_DIVE_MAP_VIEW.center,
  zoom: DEEP_DIVE_MAP_VIEW.zoom,
  tier: COIN_PAGE_TIER,
}

const centredOn = (
  center: [number, number],
  changes: Partial<Omit<DeepDiveMapView, "center">> = {},
): DeepDiveMapView => ({ ...DEFAULT_VIEW, ...changes, center })

/**
 * How a coin's deep-dive map opens, from the coin's `culture_or_period`.
 *
 * Anything containing "Roman" keeps the default (the empire from above, on
 * Realms). The rest open somewhere that suits the culture:
 *
 *   Judea                                  Jerusalem, Admin areas, as close as labels allow
 *   Carthage                               Carthage, Admin areas, as close as labels allow
 *   Byzantine                              Constantinople, default zoom and tier
 *   Persian, Parthia, Sassanian, Sassanid  Ctesiphon, default zoom, Realms
 *   Ancient Greece                         Athens, default zoom and tier
 *   Gallic Empire                          Colonia Agrippina, a little closer, Realms
 *   Palmyrene Empire                       Palmyra, a little closer, Realms
 *
 * Anything else, or nothing, gets the default. Matching ignores case.
 *
 * The coin's year (its earliest minting year) is for one case: where the view
 * would open on Admin areas but the coin is older than any admin area on the
 * map, it opens on Realms at the default zoom, centred the same, instead of on
 * an empty map.
 */
export function deepDiveMapViewFor(
  culture: string | null | undefined,
  year?: number | null,
): DeepDiveMapView {
  const name = culture?.trim().toLowerCase() ?? ""

  if (name.includes("roman")) return DEFAULT_VIEW

  const adminAreas = (center: [number, number]): DeepDiveMapView =>
    typeof year === "number" && year < FIRST_ADMIN_AREAS_YEAR
      ? centredOn(center)
      : centredOn(center, { zoom: ADMIN_LABEL_ZOOM, tier: "province" })

  if (/\bjud(a)?ea\b/.test(name)) return adminAreas(JERUSALEM)
  if (name.includes("carthag")) return adminAreas(CARTHAGE)
  if (name.includes("byzantin")) return centredOn(CONSTANTINOPLE)
  if (/persia|parthia|sassani/.test(name)) return centredOn(CTESIPHON)
  if (name.includes("greece") || name.includes("greek")) {
    return centredOn(ATHENS)
  }
  if (name.includes("gallic")) {
    return centredOn(COLONIA_AGRIPPINA, { zoom: GALLIC_EMPIRE_ZOOM })
  }
  if (name.includes("palmyr")) {
    return centredOn(PALMYRA, { zoom: PALMYRENE_EMPIRE_ZOOM })
  }

  return DEFAULT_VIEW
}
