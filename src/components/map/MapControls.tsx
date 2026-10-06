import { useEffect, useMemo, useState } from "react"
import { SimpleMultiSelect } from "../ui/SimpleMultiSelect"

/**
 * The chip that means "everything", so the control opens as one token instead
 * of unpacking every administrative area at once.
 */
const ALL = "__all__"

type MapControlsProps = {
  /** Chosen administrative areas, or null for all of them. */
  selectedProvinces: string[] | null
  /** Callback when the selection changes; null means all. */
  onProvincesChange: (provinces: string[] | null) => void
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
  /** Mint pins from the mints table. */
  showMints: boolean
  onShowMintsChange: (show: boolean) => void
  /** Places of kind "city" from the places table. */
  showCities: boolean
  onShowCitiesChange: (show: boolean) => void
  /** Every place in the places table, cities included. */
  showPois: boolean
  onShowPoisChange: (show: boolean) => void
}

export function MapControls({
  selectedProvinces,
  onProvincesChange,
  showProvinceLabels,
  onProvinceLabelsChange,
  provinceNames,
  showMints,
  onShowMintsChange,
  showCities,
  onShowCitiesChange,
  showPois,
  onShowPoisChange,
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
                Show administrative area labels
              </span>
            </label>

            {(
              [
                ["Show mints", showMints, onShowMintsChange],
                ["Show cities", showCities, onShowCitiesChange],
                ["Show POI", showPois, onShowPoisChange],
              ] as const
            ).map(([label, checked, onChange]) => (
              <label
                key={label}
                className="flex cursor-pointer items-center space-x-2"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                  className="border-paper-edge text-map-label focus:ring-map-label h-4 w-4 rounded"
                />
                <span className="text-paper-ink text-sm">{label}</span>
              </label>
            ))}
          </div>

          {showPois && showCities && (
            <p className="text-paper-ink-muted text-xs">
              POI already includes cities, so they are drawn once.
            </p>
          )}
        </div>
      </div>

      {/* Roman Provinces - Full width section */}
      <div className="border-paper-edge border-t pt-4">
        <div className="space-y-2">
          <h3 className="text-paper-ink text-sm font-medium">
            Administrative areas
          </h3>
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <div className="w-full min-w-0 flex-1 sm:w-auto">
              <SimpleMultiSelect
                options={[{ value: ALL, label: "ALL" }, ...provinceOptions]}
                selectedValues={selectedProvinces ?? [ALL]}
                onSelectionChange={(values) => {
                  const picked = values.filter((value) => value !== ALL)
                  // Choosing ALL when it was not already chosen means all of
                  // them; choosing anything else drops out of ALL.
                  const wantsAll =
                    values.includes(ALL) && selectedProvinces !== null
                  onProvincesChange(wantsAll ? null : picked)
                }}
                placeholder={
                  provincesLoading
                    ? "Loading administrative areas..."
                    : "Select administrative areas to highlight..."
                }
                maxHeight="max-h-48"
              />
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button
                onClick={() => onProvincesChange(null)}
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces === null
                }
                className="border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                title="Select all administrative areas"
              >
                Select All
              </button>
              <button
                onClick={() => onProvincesChange([])}
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces?.length === 0
                }
                className="border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                title="Clear all selected provinces"
              >
                Clear All
              </button>
            </div>
          </div>
          <p className="text-paper-ink-muted text-xs">
            {selectedProvinces === null
              ? `Showing all ${provinceOptions.length} administrative areas`
              : selectedProvinces.length === 0
                ? "No administrative areas shown"
                : `Showing ${selectedProvinces.length} of ${provinceOptions.length} administrative areas`}
          </p>
        </div>
      </div>
    </div>
  )
}
