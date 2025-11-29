"use client"

import { useEffect, useState } from "react"
import type { Deity } from "~/database/schema-deities"

type EditDeityModalProps = {
  isOpen: boolean
  onClose: () => void
  deity: Deity | null
  onSave: (id: number, updates: Partial<Deity>) => Promise<void>
  isSaving?: boolean
}

export function EditDeityModal({
  isOpen,
  onClose,
  deity,
  onSave,
  isSaving = false,
}: EditDeityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    flavour_text: "",
    secondary_info: "",
    alt_names_raw: "",
    similar_gods_raw: "",
    god_of_raw: "",
    legends_coinage_raw: "",
    historical_sources_raw: "",
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize form data when deity changes
  useEffect(() => {
    if (deity) {
      const initialData = {
        name: deity.name,
        subtitle: deity.subtitle ?? "",
        flavour_text: deity.flavour_text ?? "",
        secondary_info: deity.secondary_info ?? "",
        alt_names_raw: deity.alt_names?.join(", ") ?? "",
        similar_gods_raw: deity.similar_gods?.join(", ") ?? "",
        god_of_raw: deity.god_of?.join(", ") ?? "",
        legends_coinage_raw: deity.legends_coinage?.join(", ") ?? "",
        historical_sources_raw: deity.historical_sources?.join(", ") ?? "",
      }
      setFormData(initialData)
      setHasChanges(false)
      setErrorMessage(null)
    }
  }, [deity])

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const processArrayString = (arrayString: string): string[] => {
    if (!arrayString.trim()) return []

    return arrayString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deity || !hasChanges) return

    // Clear any previous error message
    setErrorMessage(null)

    const updates = {
      name: formData.name.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      flavour_text: formData.flavour_text.trim() || null,
      secondary_info: formData.secondary_info.trim() || null,
      alt_names: processArrayString(formData.alt_names_raw),
      similar_gods: processArrayString(formData.similar_gods_raw),
      god_of: processArrayString(formData.god_of_raw),
      legends_coinage: processArrayString(formData.legends_coinage_raw),
      historical_sources: processArrayString(formData.historical_sources_raw),
    }

    // Validate required fields
    if (!updates.name) {
      setErrorMessage("Name is required")
      return
    }

    if (updates.god_of.length === 0) {
      setErrorMessage("At least one domain (god of) is required")
      return
    }

    try {
      await onSave(deity.id, updates)
      setHasChanges(false)
      onClose()
    } catch (error) {
      console.error("Failed to save deity:", error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save changes. Please try again.",
      )
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop itself, not on child elements
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen || !deity) return null

  return (
    <div
      className="z-modal bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black p-4"
      onClick={handleBackdropClick}
    >
      <div className="somnus-card max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 border-b border-gray-200 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Edit Deity: {deity.name}
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
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Jupiter, Mars, Victoria..."
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="King of the Gods, God of War..."
            />
          </div>

          {/* God Of */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              God Of (Domains) *
            </label>
            <input
              type="text"
              value={formData.god_of_raw}
              onChange={(e) => handleFieldChange("god_of_raw", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="sky, thunder, justice, state..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple domains with commas
            </p>
          </div>

          {/* Alternative Names */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Alternative Names
            </label>
            <input
              type="text"
              value={formData.alt_names_raw}
              onChange={(e) =>
                handleFieldChange("alt_names_raw", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Jove, Optimus Maximus..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple names with commas
            </p>
          </div>

          {/* Similar Gods */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Similar Gods (Other Cultures)
            </label>
            <input
              type="text"
              value={formData.similar_gods_raw}
              onChange={(e) =>
                handleFieldChange("similar_gods_raw", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Zeus, Ammon..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple gods with commas
            </p>
          </div>

          {/* Legends on Coinage */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Legends on Coinage
            </label>
            <input
              type="text"
              value={formData.legends_coinage_raw}
              onChange={(e) =>
                handleFieldChange("legends_coinage_raw", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="IOM, IOVI OPTIMO MAXIMO, CONSERVATORI..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple legends with commas
            </p>
          </div>

          {/* Historical Sources */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Historical Sources
            </label>
            <input
              type="text"
              value={formData.historical_sources_raw}
              onChange={(e) =>
                handleFieldChange("historical_sources_raw", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="Ovid Metamorphoses 1.163, Pliny Natural History 2.7..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple sources with commas
            </p>
          </div>

          {/* Flavour Text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              value={formData.flavour_text}
              onChange={(e) =>
                handleFieldChange("flavour_text", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              rows={4}
              placeholder="Rich description of the deity's role and significance..."
            />
          </div>

          {/* Secondary Information */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Secondary Information
            </label>
            <textarea
              value={formData.secondary_info}
              onChange={(e) =>
                handleFieldChange("secondary_info", e.target.value)
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              rows={3}
              placeholder="Additional descriptive information, iconography, or coin-specific details..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges || isSaving}
              className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
