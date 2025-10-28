import React from "react"
import { ROMAN_PROVINCES } from "../../constants/provinces"
import { SimpleMultiSelect } from "../ui/SimpleMultiSelect"

type MapEmbeddedControlsProps = {
  // Layout
  layout?: "default" | "fullscreen"

  // Empire layers
  empireLayerConfig: Record<string, { name: string; description: string }>
  isLayerVisible: (key: string) => boolean
  toggleLayer: (key: string) => void
  hasAnyEmpireLayerVisible: () => boolean
  clearAllEmpireLayers: () => void

  // Provinces
  provinceOptions: Array<{ value: string; label: string }>
  selectedProvinces: string[]
  onProvinceSelectionChange: (provinces: string[]) => void
  provincesLoading: boolean
  showProvinceLabels: boolean
  onShowProvinceLabelsChange: (show: boolean) => void
}

/**
 * Embedded controls for the Map component.
 * Provides time period selection, empire layer toggles, and province selection.
 */
export const MapEmbeddedControls: React.FC<MapEmbeddedControlsProps> = ({
  layout = "default",
  empireLayerConfig,
  isLayerVisible,
  toggleLayer,
  hasAnyEmpireLayerVisible,
  clearAllEmpireLayers,
  provinceOptions,
  selectedProvinces,
  onProvinceSelectionChange,
  provincesLoading,
  showProvinceLabels,
  onShowProvinceLabelsChange,
}) => {
  const handleSelectAllProvinces = () => {
    onProvinceSelectionChange([...ROMAN_PROVINCES])
  }

  const handleClearAllProvinces = () => {
    onProvinceSelectionChange([])
  }

  const handleToggleLabels = () => {
    onShowProvinceLabelsChange(!showProvinceLabels)
  }



  return (
    <div
      className={
        layout === "fullscreen"
          ? "order-2 rounded-lg border bg-white p-4 shadow-sm"
          : ""
      }
    >
      <div
        className={
          layout === "fullscreen"
            ? "grid grid-cols-1 gap-4 space-y-0 md:grid-cols-3"
            : "space-y-4"
        }
      >
        {/* Empire Extent Layers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Empire Extent</h3>
            {hasAnyEmpireLayerVisible() && (
              <button
                onClick={clearAllEmpireLayers}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Clear all empire layers
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(empireLayerConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                  isLayerVisible(key)
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-amber-200 bg-white text-amber-800 hover:border-amber-300 hover:bg-amber-50"
                }`}
                title={config.description}
              >
                {config.name}
              </button>
            ))}
          </div>
          {hasAnyEmpireLayerVisible() && (
            <div className="space-y-1 text-xs text-gray-600">
              {Object.entries(empireLayerConfig).map(
                ([key, config]) =>
                  isLayerVisible(key) && (
                    <div key={key} className="truncate">
                      <strong>{config.name}:</strong> {config.description}
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Roman Provinces - Full width section */}
      <div
        className={
          layout === "fullscreen"
            ? "mt-4 border-t border-gray-200 pt-4"
            : "mt-4"
        }
      >
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Roman Provinces</h3>
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <div className="w-full min-w-0 flex-1 sm:w-auto">
              <SimpleMultiSelect
                options={provinceOptions}
                selectedValues={selectedProvinces}
                onSelectionChange={onProvinceSelectionChange}
                placeholder={
                  provincesLoading
                    ? "Loading provinces..."
                    : "Select provinces to highlight..."
                }
                className="w-full rounded-md border border-gray-300 bg-white text-gray-900"
                maxHeight="max-h-48"
              />
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button
                onClick={handleSelectAllProvinces}
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces.length === ROMAN_PROVINCES.length
                }
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Select all provinces"
              >
                Select All
              </button>
              <button
                onClick={handleClearAllProvinces}
                disabled={
                  provincesLoading ||
                  provinceOptions.length === 0 ||
                  selectedProvinces.length === 0
                }
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Clear all selected provinces"
              >
                Clear All
              </button>
              <button
                onClick={handleToggleLabels}
                className={`rounded-md border px-3 py-2 text-sm ${
                  showProvinceLabels
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                title={
                  showProvinceLabels
                    ? "Hide province labels"
                    : "Show province labels"
                }
              >
                {showProvinceLabels ? "Hide Labels" : "Show Labels"}
              </button>
            </div>
          </div>
          {selectedProvinces.length > 0 && (
            <div className="text-xs text-gray-600">
              Showing {selectedProvinces.length} province
              {selectedProvinces.length !== 1 ? "s" : ""} highlighted on the map
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
