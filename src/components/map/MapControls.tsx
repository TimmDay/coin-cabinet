import { useEffect, useMemo, useState } from "react"
import { SimpleMultiSelect } from "../ui/SimpleMultiSelect"
import { ROMAN_PROVINCES } from "./constants/provinces"

type MapControlsProps = {
  /** Show BC 60 empire extent layer */
  showBC60?: boolean
  /** Show AD 14 empire extent layer */
  showAD14?: boolean
  /** Show AD 69 empire extent layer */
  showAD69?: boolean
  /** Show AD 117 empire extent layer */
  showAD117?: boolean
  /** Show AD 200 empire extent layer */
  showAD200?: boolean
  /** Callback when BC60 layer toggle changes */
  onBC60Change?: (show: boolean) => void
  /** Callback when AD14 layer toggle changes */
  onAD14Change?: (show: boolean) => void
  /** Callback when AD69 layer toggle changes */
  onAD69Change?: (show: boolean) => void
  /** Callback when AD117 layer toggle changes */
  onAD117Change?: (show: boolean) => void
  /** Callback when AD200 layer toggle changes */
  onAD200Change?: (show: boolean) => void
  /** Selected provinces */
  selectedProvinces: string[]
  /** Callback when provinces selection changes */
  onProvincesChange: (provinces: string[]) => void
  /** Show province labels */
  showProvinceLabels: boolean
  /** Callback when province labels toggle changes */
  onProvinceLabelsChange: (show: boolean) => void
}

export function MapControls({
  showBC60 = false,
  showAD14 = false,
  showAD69 = false,
  showAD117 = false,
  showAD200 = false,
  onBC60Change,
  onAD14Change,
  onAD69Change,
  onAD117Change,
  onAD200Change,
  selectedProvinces,
  onProvincesChange,
  showProvinceLabels,
  onProvinceLabelsChange,
}: MapControlsProps) {
  // Provinces data loading
  const [provincesData, setProvincesData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [provincesLoading, setProvincesLoading] = useState(false)

  // Load provinces data
  useEffect(() => {
    setProvincesLoading(true)
    fetch("/data/provinces.geojson")
      .then((response) => response.json())
      .then((data: GeoJSON.FeatureCollection) => {
        setProvincesData(data)
      })
      .catch((error) => {
        console.error("Error loading provinces data:", error)
      })
      .finally(() => {
        setProvincesLoading(false)
      })
  }, [])

  // Generate province options from loaded data
  const provinceOptions = useMemo(() => {
    if (!provincesData?.features) return []

    return provincesData.features
      .map((feature: GeoJSON.Feature) => ({
        value: (feature.properties?.name ??
          feature.properties?.Name ??
          "") as string,
        label: (feature.properties?.name ??
          feature.properties?.Name ??
          "") as string,
      }))
      .filter((option) => option.value)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [provincesData])

  const hasAnyEmpireLayerVisible = () => {
    return showBC60 || showAD14 || showAD69 || showAD117 || showAD200
  }

  const clearAllEmpireLayers = () => {
    onBC60Change?.(false)
    onAD14Change?.(false)
    onAD69Change?.(false)
    onAD117Change?.(false)
    onAD200Change?.(false)
  }

  return (
    <div className="border-paper-edge bg-paper space-y-4 rounded-lg border p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Empire Extent Layers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-paper-ink text-sm font-medium">
              Empire Extent
            </h3>
            {hasAnyEmpireLayerVisible() && (
              <button
                onClick={clearAllEmpireLayers}
                className="text-paper-ink-muted hover:text-paper-ink text-xs underline"
              >
                Clear all layers
              </button>
            )}
          </div>
          <div className="space-y-1">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={showBC60}
                onChange={(e) => onBC60Change?.(e.target.checked)}
                className="border-paper-edge text-map-label focus:ring-map-label h-4 w-4 rounded"
              />
              <span className="text-paper-ink text-sm">BC 60 (Republic)</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={showAD14}
                onChange={(e) => onAD14Change?.(e.target.checked)}
                className="border-paper-edge text-map-label focus:ring-map-label h-4 w-4 rounded"
              />
              <span className="text-paper-ink text-sm">AD 14 (Augustus)</span>
            </label>
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={showAD69}
                onChange={(e) => onAD69Change?.(e.target.checked)}
                className="border-paper-edge text-map-label focus:ring-map-label h-4 w-4 rounded"
              />
              <span className="text-paper-ink text-sm">
                AD 69 (Year of Four Emperors)
              </span>
            </label>
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={showAD117}
                onChange={(e) => onAD117Change?.(e.target.checked)}
                className="border-paper-edge text-map-label focus:ring-map-label h-4 w-4 rounded"
              />
              <span className="text-paper-ink text-sm">AD 117 (Trajan)</span>
            </label>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="space-y-2">
          <h3 className="text-paper-ink text-sm font-medium">
            Display Options
          </h3>
          <div className="space-y-1">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                checked={showProvinceLabels}
                onChange={(e) => onProvinceLabelsChange(e.target.checked)}
                className="border-paper-edge text-map-label focus:ring-map-label h-4 w-4 rounded"
              />
              <span className="text-paper-ink text-sm">
                Show Province Labels
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Roman Provinces - Full width section */}
      <div className="border-paper-edge border-t pt-4">
        <div className="space-y-2">
          <h3 className="text-paper-ink text-sm font-medium">
            Roman Provinces
          </h3>
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <div className="w-full min-w-0 flex-1 sm:w-auto">
              <SimpleMultiSelect
                options={provinceOptions}
                selectedValues={selectedProvinces}
                onSelectionChange={onProvincesChange}
                placeholder={
                  provincesLoading
                    ? "Loading provinces..."
                    : "Select provinces to highlight..."
                }
                maxHeight="max-h-48"
              />
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button
                onClick={() => onProvincesChange([...ROMAN_PROVINCES])}
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces.length === ROMAN_PROVINCES.length
                }
                className="border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                title="Select all provinces"
              >
                Select All
              </button>
              <button
                onClick={() => onProvincesChange([])}
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces.length === 0
                }
                className="border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                title="Clear all selected provinces"
              >
                Clear All
              </button>
            </div>
          </div>
          {selectedProvinces.length > 0 && (
            <div className="text-paper-ink-muted text-xs">
              Showing {selectedProvinces.length} province
              {selectedProvinces.length !== 1 ? "s" : ""} highlighted on the map
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
