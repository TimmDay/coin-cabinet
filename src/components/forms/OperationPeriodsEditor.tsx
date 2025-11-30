"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus } from "lucide-react"

export type OperationPeriod = [number, number, string] // [startYear, endYear, description]

type OperationPeriodsEditorProps = {
  value?: string // JSON string from form
  onChange: (jsonString: string) => void // Callback with JSON string
  error?: string
  className?: string
}

export function OperationPeriodsEditor({
  value = "",
  onChange,
  error,
  className = "",
}: OperationPeriodsEditorProps) {
  const [periods, setPeriods] = useState<OperationPeriod[]>([])

  // Parse JSON string to periods array when value changes
  useEffect(() => {
    if (!value || value === "") {
      setPeriods([])
      return
    }

    try {
      const parsed = JSON.parse(value) as OperationPeriod[]
      if (Array.isArray(parsed)) {
        setPeriods(parsed)
      } else {
        setPeriods([])
      }
    } catch {
      // If JSON is invalid, start with empty array
      setPeriods([])
    }
  }, [value])

  // Convert periods array to JSON string and call onChange
  const updateFormValue = (newPeriods: OperationPeriod[]) => {
    setPeriods(newPeriods)
    const jsonString = newPeriods.length > 0 ? JSON.stringify(newPeriods) : ""
    onChange(jsonString)
  }

  const addPeriod = () => {
    const newPeriod: OperationPeriod = [0, 0, ""]
    updateFormValue([...periods, newPeriod])
  }

  const updatePeriod = (
    index: number,
    field: "start" | "end" | "description",
    value: string | number,
  ) => {
    const newPeriods = [...periods]
    const currentPeriod = newPeriods[index]

    if (!currentPeriod) return // Safety check

    if (field === "start") {
      newPeriods[index] = [Number(value), currentPeriod[1], currentPeriod[2]]
    } else if (field === "end") {
      newPeriods[index] = [currentPeriod[0], Number(value), currentPeriod[2]]
    } else if (field === "description") {
      newPeriods[index] = [currentPeriod[0], currentPeriod[1], String(value)]
    }
    updateFormValue(newPeriods)
  }

  const removePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index)
    updateFormValue(newPeriods)
  }

  const inputClass =
    "w-full px-2 py-1 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors text-sm"

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-300">
            Operation Periods
          </label>
          <button
            type="button"
            onClick={addPeriod}
            className="flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-xs text-white transition-colors hover:bg-amber-600"
          >
            <Plus size={12} />
            Add Period
          </button>
        </div>

        {/* Table */}
        {periods.length > 0 && (
          <div className="overflow-hidden rounded-md border border-slate-600">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 bg-slate-700/50 px-3 py-2 text-xs font-medium text-slate-300">
              <div className="col-span-3">Start Year</div>
              <div className="col-span-3">End Year</div>
              <div className="col-span-5">Description/Ruler</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-600">
              {periods.map((period, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 bg-slate-800/30 px-3 py-2"
                >
                  {/* Start Year */}
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="e.g., -260"
                      value={period[0] || ""}
                      onChange={(e) =>
                        updatePeriod(
                          index,
                          "start",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* End Year */}
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="e.g., 476"
                      value={period[1] || ""}
                      onChange={(e) =>
                        updatePeriod(
                          index,
                          "end",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="e.g., Republic, Diocletian"
                      value={period[2] || ""}
                      onChange={(e) =>
                        updatePeriod(index, "description", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removePeriod(index)}
                      className="p-1 text-red-400 transition-colors hover:text-red-300"
                      title="Remove period"
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
        {periods.length === 0 && (
          <div className="rounded-md border-2 border-dashed border-slate-600 px-4 py-6 text-center">
            <p className="mb-2 text-sm text-slate-400">
              No operation periods defined
            </p>
            <button
              type="button"
              onClick={addPeriod}
              className="text-sm text-amber-500 transition-colors hover:text-amber-400"
            >
              + Add first period
            </button>
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-slate-400">
          Define the time periods when this mint was operational. Each period
          includes start/end years and a description of the ruler or era.
        </p>

        {/* Error Message */}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  )
}
