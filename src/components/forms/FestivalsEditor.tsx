"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus } from "lucide-react"
import type { Festival } from "~/database/schema-deities"

type FestivalsEditorProps = {
  value?: string // JSON string from form
  onChange: (jsonString: string) => void // Callback with JSON string
  error?: string
  className?: string
}

export function FestivalsEditor({
  value = "",
  onChange,
  error,
  className = "",
}: FestivalsEditorProps) {
  const [festivals, setFestivals] = useState<Festival[]>([])

  // Parse JSON string to festivals array when value changes
  useEffect(() => {
    if (!value || value === "") {
      setFestivals([])
      return
    }

    try {
      const parsed = JSON.parse(value) as Festival[]

      if (Array.isArray(parsed)) {
        // Handle case where items might have 'notes' instead of 'note' (backward compatibility)
        const normalizedFestivals = parsed.map((festival) => {
          const legacyFestival = festival as
            | Festival
            | { name: string; date?: string; notes?: string }
          if (
            "notes" in legacyFestival &&
            legacyFestival.notes &&
            !("note" in legacyFestival)
          ) {
            // Convert old 'notes' field to 'note'
            return {
              name: legacyFestival.name,
              date: legacyFestival.date,
              note: legacyFestival.notes,
            } as Festival
          }
          return festival
        })
        setFestivals(normalizedFestivals)
      } else {
        setFestivals([])
      }
    } catch {
      setFestivals([])
    }
  }, [value])

  // Convert festivals array to JSON string and call onChange
  const updateFormValue = (newFestivals: Festival[]) => {
    setFestivals(newFestivals)
    const jsonString =
      newFestivals.length > 0 ? JSON.stringify(newFestivals) : ""
    onChange(jsonString)
  }

  const addFestival = () => {
    const newFestival: Festival = { name: "", date: "", note: "" }
    updateFormValue([...festivals, newFestival])
  }

  const updateFestival = (
    index: number,
    field: keyof Festival,
    value: string | string[],
  ) => {
    const newFestivals = [...festivals]
    const currentFestival = newFestivals[index]

    if (!currentFestival) return // Safety check

    newFestivals[index] = {
      ...currentFestival,
      [field]: value,
    }
    updateFormValue(newFestivals)
  }

  const removeFestival = (index: number) => {
    const newFestivals = festivals.filter((_, i) => i !== index)
    updateFormValue(newFestivals)
  }

  const inputClass =
    "w-full px-2 py-1 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors text-sm"

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-300">
            Associated Festivals
          </label>
          <button
            type="button"
            onClick={addFestival}
            className="flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-xs text-white transition-colors hover:bg-amber-600"
          >
            <Plus size={12} />
            Add Festival
          </button>
        </div>

        {/* Table */}
        {festivals.length > 0 && (
          <div className="overflow-hidden rounded-md border border-slate-600">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 bg-slate-700/50 px-3 py-2 text-xs font-medium text-slate-300">
              <div className="col-span-4">Festival Name</div>
              <div className="col-span-3">Date (Optional)</div>
              <div className="col-span-4">Note (Optional)</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-600">
              {festivals.map((festival, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-12 gap-2 bg-slate-800/30 px-3 py-2"
                >
                  {/* Festival Name */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g., Ides of Mars"
                      value={festival.name || ""}
                      onChange={(e) =>
                        updateFestival(index, "name", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Date */}
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="03/15 (optional)"
                      value={festival.date ?? ""}
                      onChange={(e) =>
                        updateFestival(index, "date", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Note */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g., Celebrated in Rome"
                      value={festival.note ?? ""}
                      onChange={(e) =>
                        updateFestival(index, "note", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeFestival(index)}
                      className="p-1 text-red-400 transition-colors hover:text-red-300"
                      title="Remove festival"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {festivals.length === 0 && (
          <div className="rounded-md border-2 border-dashed border-slate-600 px-4 py-6 text-center">
            <p className="mb-2 text-sm text-slate-400">No festivals defined</p>
            <button
              type="button"
              onClick={addFestival}
              className="text-sm text-amber-500 transition-colors hover:text-amber-400"
            >
              + Add first festival
            </button>
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-slate-400">
          Define festivals associated with this deity. Each festival includes a
          name, optional date (MM/DD format), and optional note about the
          celebration.
        </p>

        {/* Error Message */}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  )
}
