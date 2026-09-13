import { useMemo } from "react"

export type MapConfiguration = {
  defaultZoom: number
  minZoom: number
  maxZoom: number
}

/**
 * Centralized map configuration hook
 * Makes it easy to adjust map settings in one place
 */
export const useMapConfiguration = (): MapConfiguration => {
  return useMemo(
    () => ({
      defaultZoom: 5,
      minZoom: 3,
      maxZoom: 14,
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
