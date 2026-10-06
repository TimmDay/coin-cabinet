import { useMemo } from "react"
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
   * The administrative areas to offer, from the caller's Jurisdiction corpus,
   * so the list always matches what the map can actually draw.
   */
  provinceNames: string[]
}

export function MapControls({
  selectedProvinces,
  onProvincesChange,
  showProvinceLabels,
  onProvinceLabelsChange,
  provinceNames,
}: MapControlsProps) {
  const provinceOptions = useMemo(
    () =>
      provinceNames
        .map((name) => ({ value: name, label: name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [provinceNames],
  )

  return (
    <div className="border-line bg-surface-raised space-y-4 rounded-lg border p-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-ink text-sm font-medium">Administrative areas</h3>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showProvinceLabels}
              onChange={(e) => onProvinceLabelsChange(e.target.checked)}
              className="border-ink-muted text-map-label focus:ring-map-label h-4 w-4 rounded"
            />
            <span className="text-ink text-sm">Show labels</span>
          </label>
        </div>
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
              placeholder="Select administrative areas to highlight..."
              maxHeight="max-h-48"
            />
          </div>
          <div className="flex flex-shrink-0 gap-1">
            <button
              onClick={() => onProvincesChange([])}
              disabled={
                provinceOptions.length === 0 || selectedProvinces?.length === 0
              }
              className="border-ink-muted text-ink hover:bg-surface-muted focus-visible:outline-ink rounded-md border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              title="Clear all selected administrative areas"
            >
              Clear All
            </button>
          </div>
        </div>
        <p className="text-ink-muted text-xs">
          {selectedProvinces === null
            ? `Showing all ${provinceOptions.length} administrative areas`
            : selectedProvinces.length === 0
              ? "No administrative areas shown"
              : `Showing ${selectedProvinces.length} of ${provinceOptions.length} administrative areas`}
        </p>
      </div>
    </div>
  )
}
