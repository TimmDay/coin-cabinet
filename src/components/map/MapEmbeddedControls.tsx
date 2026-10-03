import React from "react"
import { SimpleMultiSelect } from "../ui/SimpleMultiSelect"
import { ROMAN_PROVINCES } from "./constants/provinces"

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
          ? "border-paper-edge bg-paper order-2 rounded-lg border p-4 shadow-sm"
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
            <h3 className="text-paper-ink text-sm font-medium">
              Empire Extent
            </h3>
            {hasAnyEmpireLayerVisible() && (
              <button
                onClick={clearAllEmpireLayers}
                className="text-paper-ink-muted hover:text-paper-ink text-xs underline"
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
                    ? "border-map-label bg-map-label text-paper-raised"
                    : "border-paper-edge bg-paper-raised text-map-label hover:border-map-label hover:bg-paper"
                }`}
                title={config.description}
              >
                {config.name}
              </button>
            ))}
          </div>
          {hasAnyEmpireLayerVisible() && (
            <div className="text-paper-ink-muted space-y-1 text-xs">
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
            ? "border-paper-edge mt-4 border-t pt-4"
            : "mt-4"
        }
      >
        <div className="space-y-2">
          <h3 className="text-paper-ink text-sm font-medium">
            Roman Provinces
          </h3>
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
                className="border-paper-edge bg-paper-raised text-paper-ink w-full rounded-md border"
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
                className="border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
                className="border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                title="Clear all selected provinces"
              >
                Clear All
              </button>
              <button
                onClick={handleToggleLabels}
                className={`rounded-md border px-3 py-2 text-sm ${
                  showProvinceLabels
                    ? "border-map-label bg-paper-raised text-map-label hover:bg-paper"
                    : "border-paper-edge bg-paper-raised text-paper-ink hover:bg-paper"
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
