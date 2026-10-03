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
