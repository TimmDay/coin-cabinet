import { useEffect, useMemo, useState } from "react"
import { SimpleMultiSelect } from "../ui/SimpleMultiSelect"

type MapControlsProps = {
  /** Selected provinces */
  selectedProvinces: string[]
  /** Callback when provinces selection changes */
  onProvincesChange: (provinces: string[]) => void
  /** Show province labels */
  showProvinceLabels: boolean
  /** Callback when province labels toggle changes */
  onProvinceLabelsChange: (show: boolean) => void
  /**
   * Province names to offer. Supplied by callers that already hold the
   * Jurisdiction corpus, so the list matches what the map can actually draw
   * rather than a separately fetched file.
   */
  provinceNames?: string[]
}

export function MapControls({
  selectedProvinces,
  onProvincesChange,
  showProvinceLabels,
  onProvinceLabelsChange,
  provinceNames,
}: MapControlsProps) {
  // Provinces data loading
  const [provincesData, setProvincesData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [provincesLoading, setProvincesLoading] = useState(false)

  // Load provinces data, unless the caller already has the names.
  useEffect(() => {
    if (provinceNames) return
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
  }, [provinceNames])

  // Generate province options from loaded data
  const provinceOptions = useMemo(() => {
    if (provinceNames) {
      return provinceNames
        .map((name) => ({ value: name, label: name }))
        .sort((a, b) => a.label.localeCompare(b.label))
    }
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
  }, [provincesData, provinceNames])

  return (
    <div className="border-paper-edge bg-paper space-y-4 rounded-lg border p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                onClick={() =>
                  onProvincesChange(provinceOptions.map((o) => o.value))
                }
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces.length === provinceOptions.length
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
