import { useEffect, useState } from "react"
import type { EmpireLayerConfigMap } from "../mapConfig"

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

/**
 * Loads each empire extent layer's GeoJSON the first time it is shown. Which
 * layers are shown comes from the config's `showProp`, so the caller owns it.
 */
export const useEmpireLayerData = (empireLayerConfig: EmpireLayerConfigMap) => {
  const [layerData, setLayerData] = useState<
    Record<string, GeoJSON.FeatureCollection>
  >({})

  const isLayerVisible = (key: string): boolean =>
    empireLayerConfig[key as keyof EmpireLayerConfigMap]?.showProp === true

  useEffect(() => {
    for (const [key, config] of Object.entries(empireLayerConfig)) {
      if (config.showProp !== true || layerData[key]) continue

      void (async () => {
        let data: GeoJSON.FeatureCollection
        try {
          const response = await fetch(`/data/${config.filename}`)
          if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.statusText}`)
          }
          data = (await response.json()) as GeoJSON.FeatureCollection
        } catch (error) {
          console.error(`Error loading Roman Empire ${key} data:`, error)
          data = { type: "FeatureCollection", features: [] }
        }
        setLayerData((prev) => ({ ...prev, [key]: data }))
      })()
    }
  }, [empireLayerConfig, layerData])

  const getLayerData = (key: string): GeoJSON.FeatureCollection | null =>
    layerData[key] ?? null

  return { isLayerVisible, getLayerData }
}
