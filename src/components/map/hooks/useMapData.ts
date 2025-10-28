import { useEffect, useState } from "react"

type UseMapDataResult = {
  provincesData: GeoJSON.FeatureCollection | null
  provincesLabelsData: GeoJSON.FeatureCollection | null
  loading: boolean
  error: string | null
}

/**
 * Custom hook for loading and managing map data (provinces and labels)
 */
export const useMapData = (): UseMapDataResult => {
  const [provincesData, setProvincesData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [provincesLabelsData, setProvincesLabelsData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (provincesData && provincesLabelsData) return // Already loaded

      setLoading(true)
      setError(null)

      try {
        // Load both provinces and province labels data
        const [provincesResponse, labelsResponse] = await Promise.all([
          fetch("/data/provinces.geojson"),
          fetch("/data/provinces_label.geojson"),
        ])

        if (!provincesResponse.ok) {
          throw new Error(
            `Failed to load provinces data: ${provincesResponse.statusText}`,
          )
        }
        if (!labelsResponse.ok) {
          throw new Error(
            `Failed to load province labels data: ${labelsResponse.statusText}`,
          )
        }

        const [provincesData, labelsData] = await Promise.all([
          provincesResponse.json() as Promise<GeoJSON.FeatureCollection>,
          labelsResponse.json() as Promise<GeoJSON.FeatureCollection>,
        ])

        setProvincesData(provincesData)
        setProvincesLabelsData(labelsData)
      } catch (error) {
        console.error("Error loading map data:", error)
        setError(
          error instanceof Error ? error.message : "Failed to load map data",
        )
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [provincesData, provincesLabelsData])

  return {
    provincesData,
    provincesLabelsData,
    loading,
    error,
  }
}

type EmpireLayerConfig = Record<
  string,
  {
    filename: string
    id: string
    name: string
    title: string
    description: string
    showProp?: boolean
    onChange?: (show: boolean) => void
    color?: string
    fillColor?: string
    style?: Record<string, unknown>
  }
>

/**
 * Custom hook for managing empire layer visibility and data loading state
 */
export const useEmpireLayerState = (empireLayerConfig: EmpireLayerConfig) => {
  const [layerStates, setLayerStates] = useState(() => {
    const initialStates: Record<
      string,
      { visible: boolean; data: GeoJSON.FeatureCollection | null }
    > = {}
    Object.keys(empireLayerConfig).forEach((key) => {
      initialStates[key] = { visible: false, data: null }
    })
    return initialStates
  })

  // Load empire layer data when needed
  const loadLayerData = async (layerKey: string, filename: string) => {
    try {
      const response = await fetch(`/data/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`)
      }
      const data = (await response.json()) as GeoJSON.FeatureCollection

      setLayerStates((prev) => ({
        ...prev,
        [layerKey]: {
          visible: prev[layerKey]?.visible ?? false,
          data,
        },
      }))
    } catch (error) {
      console.error(`Error loading Roman Empire ${layerKey} data:`, error)
      setLayerStates((prev) => ({
        ...prev,
        [layerKey]: {
          visible: prev[layerKey]?.visible ?? false,
          data: {
            type: "FeatureCollection",
            features: [],
          },
        },
      }))
    }
  }

  // Load layer data when it becomes visible
  useEffect(() => {
    Object.entries(empireLayerConfig).forEach(([key, config]) => {
      const layerState = layerStates[key]
      if (layerState?.visible && !layerState.data) {
        void loadLayerData(key, config.filename)
      }
    })
  }, [layerStates, empireLayerConfig])

  const isLayerVisible = (key: string): boolean =>
    layerStates[key]?.visible ?? false

  const getLayerData = (key: string): GeoJSON.FeatureCollection | null =>
    layerStates[key]?.data ?? null

  const toggleLayer = (key: string) => {
    setLayerStates((prev) => ({
      ...prev,
      [key]: {
        data: prev[key]?.data ?? null,
        visible: !prev[key]?.visible,
      },
    }))
  }

  const clearAllEmpireLayers = () => {
    setLayerStates((prev) => {
      const newStates = { ...prev }
      Object.keys(empireLayerConfig).forEach((key) => {
        newStates[key] = {
          data: prev[key]?.data ?? null,
          visible: false,
        }
      })
      return newStates
    })
  }

  const hasAnyEmpireLayerVisible = (): boolean => {
    return Object.values(layerStates).some((state) => state.visible)
  }

  return {
    layerStates,
    isLayerVisible,
    getLayerData,
    toggleLayer,
    clearAllEmpireLayers,
    hasAnyEmpireLayerVisible,
  }
}
