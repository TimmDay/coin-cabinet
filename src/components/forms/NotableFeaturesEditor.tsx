"use client"

import { Plus, Trash2 } from "lucide-react"

export type NotableFeature = {
  name: string
  subtitle?: string
  description?: string
}

type NotableFeaturesEditorProps = {
  value: NotableFeature[]
  onChange: (features: NotableFeature[]) => void
}

export function NotableFeaturesEditor({
  value,
  onChange,
}: NotableFeaturesEditorProps) {
  const features = value || []

  const updateFeatures = (newFeatures: NotableFeature[]) => {
    onChange(newFeatures)
  }

  const addFeature = () => {
    const newFeature: NotableFeature = { name: "" }
    updateFeatures([...features, newFeature])
  }

  const removeFeature = (index: number) => {
    updateFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (
    index: number,
    field: keyof NotableFeature,
    value: string,
  ) => {
    const updatedFeatures = features.map((feature, i) => {
      if (i === index) {
        return { ...feature, [field]: value || undefined }
      }
      return feature
    })
    updateFeatures(updatedFeatures)
  }

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="rounded-md border border-slate-600 bg-slate-800/30 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">
              Feature {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              title="Remove feature"
              className="rounded-md p-1 text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Name *
              </label>
              <input
                type="text"
                value={feature.name ?? ""}
                onChange={(e) => updateFeature(index, "name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., Unique die crack, Rare mint mark"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Subtitle
              </label>
              <input
                type="text"
                value={feature.subtitle ?? ""}
                onChange={(e) =>
                  updateFeature(index, "subtitle", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., Visible on obverse, Mint error"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                value={feature.description ?? ""}
                onChange={(e) =>
                  updateFeature(index, "description", e.target.value)
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Detailed description of this notable feature..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addFeature}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-600 p-4 text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300"
      >
        <Plus className="h-4 w-4" />
        Add Notable Feature
      </button>

      {features.length === 0 && (
        <p className="text-center text-sm text-slate-400">
          No notable features added yet. Click the button above to add features
          like unique die cracks, rare mint marks, or other interesting
          characteristics.
        </p>
      )}
    </div>
  )
}
