import type {
  FitBoundsOptions,
  LatLngBoundsExpression,
  Map as LeafletMap,
} from "leaflet"
import { useCallback, useMemo } from "react"

type UseMapEventsProps = {
  onCenterToRome?: () => void
  onZoomChange?: (zoom: number) => void
  romeCoordinates: [number, number]
}

/**
 * Custom hook for centralized map event handling
 */
export const useMapEvents = ({
  onCenterToRome,
  onZoomChange,
  romeCoordinates,
}: UseMapEventsProps) => {
  const centerToRome = useCallback(
    (map: LeafletMap) => {
      map.setView(romeCoordinates, 5)
      onCenterToRome?.()
    },
    [romeCoordinates, onCenterToRome],
  )

  const handleZoomEnd = useCallback(
    (map: LeafletMap) => {
      const zoom = map.getZoom()
      onZoomChange?.(zoom)
    },
    [onZoomChange],
  )

  // Memoized event handlers for performance
  const eventHandlers = useMemo(
    () => ({
      centerToRome,
      handleZoomEnd,
    }),
    [centerToRome, handleZoomEnd],
  )

  return eventHandlers
}

/**
 * Hook for managing map reference and common operations
 */
export const useMapOperations = () => {
  const getMapBounds = useCallback((map: LeafletMap | null) => {
    if (!map) return null
    return map.getBounds()
  }, [])

  const getCurrentZoom = useCallback(
    (map: LeafletMap | null): number | null => {
      if (!map) return null
      return map.getZoom()
    },
    [],
  )

  const getCurrentCenter = useCallback((map: LeafletMap | null) => {
    if (!map) return null
    return map.getCenter()
  }, [])

  const fitToBounds = useCallback(
    (
      map: LeafletMap | null,
      bounds: LatLngBoundsExpression,
      options?: FitBoundsOptions,
    ) => {
      if (!map || !bounds) return
      map.fitBounds(bounds, options)
    },
    [],
  )

  return {
    getMapBounds,
    getCurrentZoom,
    getCurrentCenter,
    fitToBounds,
  }
}
