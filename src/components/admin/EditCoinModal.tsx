"use client"

import { useEffect, useState } from "react"
import type { SomnusCollection } from "~/server/db/schema"

type EditCoinModalProps = {
  isOpen: boolean
  onClose: () => void
  coin: SomnusCollection | null
  onSave: (id: number, updates: Partial<SomnusCollection>) => Promise<void>
  isSaving?: boolean
}

export function EditCoinModal({
  isOpen,
  onClose,
  coin,
  onSave,
  isSaving = false,
}: EditCoinModalProps) {
  const [formData, setFormData] = useState({
    nickname: "",
    legend_o: "",
    legend_o_expanded: "",
    legend_o_translation: "",
    desc_o: "",
    legend_r: "",
    legend_r_expanded: "",
    legend_r_translation: "",
    desc_r: "",
    flavour_text: "",
    godName: "",
    devicesRaw: "",
    setsRaw: "",
  })
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form data when coin changes
  useEffect(() => {
    if (coin) {
      const initialData = {
        nickname: coin.nickname ?? "",
        legend_o: coin.legend_o ?? "",
        legend_o_expanded: coin.legend_o_expanded ?? "",
        legend_o_translation: coin.legend_o_translation ?? "",
        desc_o: coin.desc_o ?? "",
        legend_r: coin.legend_r ?? "",
        legend_r_expanded: coin.legend_r_expanded ?? "",
        legend_r_translation: coin.legend_r_translation ?? "",
        desc_r: coin.desc_r ?? "",
        flavour_text: coin.flavour_text ?? "",
        godName: coin.godName ?? "",
        devicesRaw: coin.devices?.join(", ") ?? "",
        setsRaw: coin.sets?.join(", ") ?? "",
      }
      setFormData(initialData)
      setHasChanges(false)
    }
  }, [coin])

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const processArrayString = (
    arrayString: string,
    toLowerCase = false,
  ): string[] | null => {
    if (!arrayString.trim()) return null

    const array = arrayString
      .split(",")
      .map((item) => {
        const trimmed = item.trim()
        if (toLowerCase) {
          return trimmed.toLowerCase().replace(/\s+/g, "-")
        }
        return trimmed
      })
      .filter(Boolean)

    return array.length > 0 ? array : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coin || !hasChanges) return

    const updates = {
      nickname: formData.nickname,
      legend_o: formData.legend_o,
      legend_o_expanded: formData.legend_o_expanded,
      legend_o_translation: formData.legend_o_translation,
      desc_o: formData.desc_o,
      legend_r: formData.legend_r,
      legend_r_expanded: formData.legend_r_expanded,
      legend_r_translation: formData.legend_r_translation,
      desc_r: formData.desc_r,
      flavour_text: formData.flavour_text,
      godName: formData.godName.toLowerCase(), // Convert to lowercase
      devices: processArrayString(formData.devicesRaw, true), // Convert to lowercase
      sets: processArrayString(formData.setsRaw, false), // Keep original case for sets
    }

    try {
      await onSave(coin.id, updates)
      setHasChanges(false)
      onClose()
    } catch (error) {
      console.error("Failed to save coin:", error)
      // Error handling is done in the parent component
    }
  }

  const handleClose = () => {
    if (hasChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  if (!isOpen || !coin) return null

  return (
    <div className="z-modal bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black p-4">
      <div className="somnus-card max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 border-b border-gray-200 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Edit Coin: {coin.nickname}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Nickname */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Nickname *
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleFieldChange("nickname", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter nickname"
              required
            />
          </div>

          {/* Legend O */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Obverse Legend
            </label>
            <input
              type="text"
              value={formData.legend_o}
              onChange={(e) => handleFieldChange("legend_o", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter obverse legend"
            />
          </div>

          {/* Legend O Expanded */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Obverse Legend Expanded
            </label>
            <textarea
              value={formData.legend_o_expanded}
              onChange={(e) =>
                handleFieldChange("legend_o_expanded", e.target.value)
              }
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter expanded obverse legend"
            />
          </div>

          {/* Legend O Translation */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Obverse Legend Translation
            </label>
            <textarea
              value={formData.legend_o_translation}
              onChange={(e) =>
                handleFieldChange("legend_o_translation", e.target.value)
              }
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter obverse legend translation"
            />
          </div>

          {/* Obverse Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Obverse Description
            </label>
            <textarea
              value={formData.desc_o}
              onChange={(e) => handleFieldChange("desc_o", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Describe what appears on the obverse"
            />
          </div>

          {/* Legend R */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Reverse Legend
            </label>
            <input
              type="text"
              value={formData.legend_r}
              onChange={(e) => handleFieldChange("legend_r", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter reverse legend"
            />
          </div>

          {/* Legend R Expanded */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Reverse Legend Expanded
            </label>
            <textarea
              value={formData.legend_r_expanded}
              onChange={(e) =>
                handleFieldChange("legend_r_expanded", e.target.value)
              }
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter expanded reverse legend"
            />
          </div>

          {/* Legend R Translation */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Reverse Legend Translation
            </label>
            <textarea
              value={formData.legend_r_translation}
              onChange={(e) =>
                handleFieldChange("legend_r_translation", e.target.value)
              }
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter reverse legend translation"
            />
          </div>

          {/* Reverse Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Reverse Description
            </label>
            <textarea
              value={formData.desc_r}
              onChange={(e) => handleFieldChange("desc_r", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Describe what appears on the reverse"
            />
          </div>

          {/* Flavour Text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Flavour Text
            </label>
            <textarea
              value={formData.flavour_text}
              onChange={(e) =>
                handleFieldChange("flavour_text", e.target.value)
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Enter flavour text"
            />
          </div>

          {/* God Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              God/Deity
            </label>
            <input
              type="text"
              value={formData.godName}
              onChange={(e) => handleFieldChange("godName", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="e.g., Jupiter, Mars, Diana"
            />
            <p className="mt-1 text-sm text-gray-400">
              Will be saved in lowercase
            </p>
          </div>

          {/* Devices */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Devices
            </label>
            <input
              type="text"
              value={formData.devicesRaw}
              onChange={(e) => handleFieldChange("devicesRaw", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="e.g., concordia, victoria, mars (comma-separated)"
            />
            <p className="mt-1 text-sm text-gray-400">
              Enter devices separated by commas. Will be saved in lowercase.
            </p>
          </div>

          {/* Sets */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Sets
            </label>
            <input
              type="text"
              value={formData.setsRaw}
              onChange={(e) => handleFieldChange("setsRaw", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="e.g., Roman Imperatorial, Julio-Claudian (comma-separated)"
            />
            <p className="mt-1 text-sm text-gray-400">
              Enter sets this coin belongs to, separated by commas
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={!hasChanges || isSaving}
              className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
