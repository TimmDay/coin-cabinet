"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus } from "lucide-react"

type Field = {
  key: string
  label: string
  placeholder?: string
  type?: "text" | "array"
  required?: boolean
  colSpan: number
}

type StructuredDataEditorProps<T> = {
  title: string
  value?: string
  onChange: (jsonString: string) => void
  error?: string
  className?: string
  fields: Field[]
  emptyItem: T
  helpText?: string
  addButtonText?: string
}

export function StructuredDataEditor<T extends Record<string, unknown>>({
  title,
  value = "",
  onChange,
  error,
  className = "",
  fields,
  emptyItem,
  helpText,
  addButtonText = "Add Item",
}: StructuredDataEditorProps<T>) {
  const [items, setItems] = useState<T[]>([])

  // Parse JSON string to items array when value changes
  useEffect(() => {
    if (!value || value === "") {
      setItems([])
      return
    }

    try {
      const parsed = JSON.parse(value) as T[]
      if (Array.isArray(parsed)) {
        setItems(parsed)
      } else {
        setItems([])
      }
    } catch {
      setItems([])
    }
  }, [value])

  // Convert items array to JSON string and call onChange
  const updateFormValue = (newItems: T[]) => {
    setItems(newItems)
    const jsonString = newItems.length > 0 ? JSON.stringify(newItems) : ""
    onChange(jsonString)
  }

  const addItem = () => {
    updateFormValue([...items, emptyItem])
  }

  const updateItem = (index: number, field: string, newValue: string) => {
    const newItems = [...items]
    const currentItem = newItems[index]

    if (!currentItem) return

    if (field.endsWith("_array")) {
      // Handle array fields (like alt_names)
      const actualField = field.replace("_array", "")
      newItems[index] = {
        ...currentItem,
        [actualField]: newValue
          ? newValue
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      }
    } else {
      newItems[index] = {
        ...currentItem,
        [field]: newValue,
      }
    }
    updateFormValue(newItems)
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    updateFormValue(newItems)
  }

  const getFieldValue = (item: T, field: Field): string => {
    if (field.type === "array") {
      const value = item[field.key] as string[] | undefined
      return value?.join(", ") ?? ""
    }
    return (item[field.key] as string) ?? ""
  }

  const inputClass =
    "w-full px-2 py-1 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors text-sm"

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-300">
            {title}
          </label>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 rounded bg-purple-500/30 px-2 py-1 text-xs text-purple-200 transition-colors hover:bg-purple-500/50"
          >
            <Plus size={12} />
            {addButtonText}
          </button>
        </div>

        {/* Table */}
        {items.length > 0 && (
          <div className="overflow-hidden rounded-md border border-slate-600">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 bg-slate-700/50 px-3 py-2 text-xs font-medium text-slate-300">
              {fields.map((field) => (
                <div key={field.key} className={`col-span-${field.colSpan}`}>
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-400">*</span>
                  )}
                </div>
              ))}
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-600">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="relative grid grid-cols-12 gap-2 bg-slate-800/30 px-3 py-2"
                >
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className={`col-span-${field.colSpan}`}
                    >
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={getFieldValue(item, field)}
                        onChange={(e) =>
                          updateItem(
                            index,
                            field.type === "array"
                              ? `${field.key}_array`
                              : field.key,
                            e.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  ))}

                  {/* Delete Button */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1 text-red-400 transition-colors hover:text-red-300"
                      title={`Remove ${title.toLowerCase().slice(0, -1)}`}
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
        {items.length === 0 && (
          <div className="rounded-md border-2 border-dashed border-slate-600 px-4 py-6 text-center">
            <p className="mb-2 text-sm text-slate-400">
              No {title.toLowerCase()} defined
            </p>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-purple-400/60 transition-colors hover:text-purple-400/80"
            >
              + Add first {title.toLowerCase().slice(0, -1)}
            </button>
          </div>
        )}

        {/* Help Text */}
        {helpText && <p className="text-xs text-slate-400">{helpText}</p>}

        {/* Error Message */}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  )
}
