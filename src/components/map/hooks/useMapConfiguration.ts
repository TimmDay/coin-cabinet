import type { LatLngExpression } from "leaflet"
import { useMemo } from "react"

export type MapConfiguration = {
  defaultCenter: LatLngExpression
  defaultZoom: number
  minZoom: number
  maxZoom: number
  attribution: string
  tileLayerUrl: string
  romeCoordinates: LatLngExpression
}

/**
 * Centralized map configuration hook
 * Makes it easy to adjust map settings in one place
 */
export const useMapConfiguration = (): MapConfiguration => {
  return useMemo(
    () => ({
      defaultCenter: [41.9028, 12.4964] as LatLngExpression, // Rome
      defaultZoom: 5,
      minZoom: 3,
      maxZoom: 14,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      romeCoordinates: [41.9028, 12.4964] as LatLngExpression,
    }),
    [],
  )
}

/**
 * Hook for managing province selection logic with centralized validation
 */
export const useProvinceSelection = (
  allProvinces: string[] = [],
  externalSelectedProvinces?: string[],
) => {
  const isExternallyControlled = externalSelectedProvinces !== undefined

  // Default to showing all provinces if not externally controlled
  const defaultProvinces = useMemo(() => {
    return isExternallyControlled ? externalSelectedProvinces : allProvinces
  }, [allProvinces, externalSelectedProvinces, isExternallyControlled])

  const validateProvinces = useMemo(() => {
    return (provinces: string[]): string[] => {
      return provinces.filter((province) => allProvinces.includes(province))
    }
  }, [allProvinces])

  return {
    isExternallyControlled,
    defaultProvinces: validateProvinces(defaultProvinces),
    validateProvinces,
  }
}
