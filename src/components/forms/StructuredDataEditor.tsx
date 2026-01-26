"use client"

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Select } from "~/components/ui/Select"
import type { Place } from "~/database/schema-places"

type Field = {
  key: string
  label: string
  placeholder?: string
  type?:
    | "text"
    | "array"
    | "number"
    | "select"
    | "searchable-select"
    | "place-selector"
  options?: string[] // For select fields
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
  places?: Place[]
  placesLoading?: boolean
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
  places = [],
  placesLoading = false,
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
    } else if (field.endsWith("_number")) {
      // Handle number fields
      const actualField = field.replace("_number", "")
      const numValue = newValue ? parseFloat(newValue) : undefined
      newItems[index] = {
        ...currentItem,
        [actualField]: isNaN(numValue!) ? undefined : numValue,
      }
    } else {
      newItems[index] = {
        ...currentItem,
        [field]: newValue || undefined,
      }
    }
    updateFormValue(newItems)
  }

  // Handle place selection - populate place, lat, lng fields from selected place
  const handlePlaceSelection = (index: number, placeId: string) => {
    const newItems = [...items]
    const currentItem = newItems[index]
    if (!currentItem) return

    if (placeId && placeId !== "custom") {
      // Selected a real place - populate all fields from places DB
      const selectedPlace = places.find((p) => p.id.toString() === placeId)
      if (selectedPlace) {
        newItems[index] = {
          ...currentItem,
          place_id: placeId,
          place: selectedPlace.name,
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
        }
      }
    } else {
      // Selected "custom location" or empty - clear place_id but keep existing manual values
      newItems[index] = {
        ...currentItem,
        place_id: undefined,
      }
    }
    updateFormValue(newItems)
  }

  const removeItem = (index: number) => {
    const itemName = title.toLowerCase().slice(0, -1)
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${itemName}? This action cannot be undone.\n\nNote: You will need to save the form to persist this change to the database.`,
    )
    if (confirmed) {
      const newItems = items.filter((_, i) => i !== index)
      updateFormValue(newItems)
    }
  }

  const moveItemUp = (index: number) => {
    if (index === 0) return // Already at the top
    const newItems = [...items]
    const temp = newItems[index - 1]
    newItems[index - 1] = newItems[index]!
    newItems[index] = temp!
    updateFormValue(newItems)
  }

  const moveItemDown = (index: number) => {
    if (index === items.length - 1) return // Already at the bottom
    const newItems = [...items]
    const temp = newItems[index + 1]
    newItems[index + 1] = newItems[index]!
    newItems[index] = temp!
    updateFormValue(newItems)
  }

  const getFieldValue = (item: T, field: Field): string => {
    if (field.type === "array") {
      const value = item[field.key] as string[] | undefined
      return value?.join(", ") ?? ""
    }
    if (field.type === "number") {
      const value = item[field.key] as number | undefined
      // Return empty string if value is undefined, null, or NaN
      return value !== undefined && value !== null && !isNaN(value)
        ? value.toString()
        : ""
    }
    return (item[field.key] as string) ?? ""
  }

  // Map colSpan numbers to actual Tailwind classes to ensure they're included in the build
  // Also add mobile-specific responsive classes for timeline events editor
  const getColSpanClass = (span: number, fieldKey?: string): string => {
    const spanMap: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    }

    const baseClass = spanMap[span] ?? "col-span-1"

    // Special mobile responsive classes for timeline events
    if (fieldKey === "kind" && span === 3) {
      return "col-span-4 md:col-span-3" // 1/3 on mobile, original on desktop
    }
    if (fieldKey === "year" && span === 2) {
      return "col-span-4 md:col-span-2" // 1/3 on mobile, original on desktop
    }
    if (fieldKey === "name" && span === 7) {
      return "col-span-4 md:col-span-7" // 1/3 on mobile, original on desktop
    }
    if (fieldKey === "place_id" && span === 4) {
      return "col-span-12 md:col-span-4" // Full width on mobile, original on desktop
    }
    if (
      (fieldKey === "place" || fieldKey === "lat" || fieldKey === "lng") &&
      span === 4
    ) {
      return "col-span-4 md:col-span-4" // 1/3 on mobile, original on desktop
    }
    if ((fieldKey === "lat" || fieldKey === "lng") && span === 2) {
      return "col-span-4 md:col-span-2" // 1/3 on mobile, original on desktop
    }

    return baseClass
  }

  const inputClass =
    "w-full px-3 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none transition-colors text-sm"

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-300">
            {title}
          </label>
        </div>

        {/* Events List */}
        {items.length > 0 && (
          <div className="space-y-4">
            {items.map((item, index) => {
              // Check if this is the location row (place_id, place, lat, lng)
              const locationFields = ["place_id", "place", "lat", "lng"]
              const isLocationField = (fieldKey: string) =>
                locationFields.includes(fieldKey)
              const nonLocationFields = fields.filter(
                (f) => !isLocationField(f.key),
              )
              const locationOnlyFields = fields.filter((f) =>
                isLocationField(f.key),
              )

              return (
                <div
                  key={index}
                  className="relative mb-4 bg-slate-800/30 px-4 py-4"
                >
                  {/* Non-location fields in grid */}
                  <div className="mb-3 grid grid-cols-12 gap-3">
                    {nonLocationFields.map((field) => (
                      <div
                        key={field.key}
                        className={getColSpanClass(field.colSpan, field.key)}
                      >
                        {field.type === "place-selector" ? (
                          <Select
                            options={[
                              { value: "", label: "Custom location..." },
                              ...places.map((place) => ({
                                value: place.id.toString(),
                                label: `${place.name} (${place.kind})`,
                              })),
                            ]}
                            value={getFieldValue(item, field)}
                            onChange={(e) =>
                              handlePlaceSelection(index, e.target.value)
                            }
                            className={inputClass}
                            placeholder={
                              placesLoading
                                ? "Loading places..."
                                : field.placeholder
                            }
                            disabled={placesLoading}
                          />
                        ) : (field.type === "select" ||
                            field.type === "searchable-select") &&
                          field.options ? (
                          field.type === "searchable-select" ? (
                            <Select
                              options={field.options.map((opt) => ({
                                value: opt,
                                label: opt,
                              }))}
                              value={getFieldValue(item, field)}
                              onChange={(e) =>
                                updateItem(index, field.key, e.target.value)
                              }
                              className={inputClass}
                              placeholder={field.placeholder}
                            />
                          ) : (
                            <select
                              value={getFieldValue(item, field)}
                              onChange={(e) =>
                                updateItem(index, field.key, e.target.value)
                              }
                              className={inputClass}
                              aria-label={field.label}
                            >
                              <option value="">
                                {field.placeholder || "Select..."}
                              </option>
                              {field.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            step={field.type === "number" ? "any" : undefined}
                            placeholder={field.placeholder}
                            value={getFieldValue(item, field)}
                            onChange={(e) =>
                              updateItem(
                                index,
                                field.type === "array"
                                  ? `${field.key}_array`
                                  : field.type === "number"
                                    ? `${field.key}_number`
                                    : field.key,
                                e.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Location fields - responsive layout */}
                  <div className="space-y-3 md:space-y-0">
                    {/* Mobile: place_id on own row, others on second row. Desktop: all on same row */}

                    {/* Place selector - full width on mobile only */}
                    <div className="grid grid-cols-12 gap-3 md:hidden">
                      {locationOnlyFields
                        .filter((field) => field.key === "place_id")
                        .map((field) => (
                          <div key={field.key} className="col-span-12">
                            <Select
                              options={[
                                {
                                  value: "custom",
                                  label: "Custom location...",
                                },
                                ...places.map((place) => ({
                                  value: place.id.toString(),
                                  label: `${place.name} (${place.kind})`,
                                })),
                              ]}
                              value={
                                getFieldValue(
                                  item,
                                  locationOnlyFields.find(
                                    (f) => f.key === "place_id",
                                  )!,
                                ) || "custom"
                              }
                              onChange={(e) =>
                                handlePlaceSelection(index, e.target.value)
                              }
                              className={inputClass}
                              placeholder={
                                placesLoading
                                  ? "Loading places..."
                                  : field.placeholder
                              }
                              disabled={placesLoading}
                            />
                          </div>
                        ))}
                    </div>

                    {/* All location fields together - desktop only (hidden on mobile) */}
                    <div className="hidden grid-cols-12 gap-3 md:grid">
                      {locationOnlyFields.map((field) => {
                        const hasSelectedPlace = Boolean(item.place_id)
                        const isDisabled =
                          hasSelectedPlace && field.key !== "place_id"

                        return (
                          <div
                            key={field.key}
                            className={getColSpanClass(
                              field.colSpan,
                              field.key,
                            )}
                          >
                            {field.type === "place-selector" ? (
                              <Select
                                options={[
                                  {
                                    value: "custom",
                                    label: "Custom location...",
                                  },
                                  ...places.map((place) => ({
                                    value: place.id.toString(),
                                    label: `${place.name} (${place.kind})`,
                                  })),
                                ]}
                                value={getFieldValue(item, field) || "custom"}
                                onChange={(e) =>
                                  handlePlaceSelection(index, e.target.value)
                                }
                                className={inputClass}
                                placeholder={
                                  placesLoading
                                    ? "Loading places..."
                                    : field.placeholder
                                }
                                disabled={placesLoading}
                              />
                            ) : (
                              <input
                                type={
                                  field.type === "number" ? "number" : "text"
                                }
                                step={
                                  field.type === "number" ? "any" : undefined
                                }
                                placeholder={field.placeholder}
                                value={getFieldValue(item, field)}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    field.type === "number"
                                      ? `${field.key}_number`
                                      : field.key,
                                    e.target.value,
                                  )
                                }
                                className={`${inputClass} ${isDisabled ? "cursor-not-allowed bg-slate-700/50 opacity-50" : ""}`}
                                disabled={isDisabled}
                                title={
                                  isDisabled
                                    ? "Disabled - using data from selected place"
                                    : undefined
                                }
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Other location fields on mobile - place, lat, lng */}
                    <div className="grid grid-cols-12 gap-3 md:hidden">
                      {locationOnlyFields
                        .filter((field) => field.key !== "place_id")
                        .map((field) => {
                          const hasSelectedPlace = Boolean(item.place_id)
                          const isDisabled =
                            hasSelectedPlace && field.key !== "place_id"

                          return (
                            <div
                              key={field.key}
                              className={getColSpanClass(
                                field.colSpan,
                                field.key,
                              )}
                            >
                              <input
                                type={
                                  field.type === "number" ? "number" : "text"
                                }
                                step={
                                  field.type === "number" ? "any" : undefined
                                }
                                placeholder={field.placeholder}
                                value={getFieldValue(item, field)}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    field.type === "number"
                                      ? `${field.key}_number`
                                      : field.key,
                                    e.target.value,
                                  )
                                }
                                className={`${inputClass} ${isDisabled ? "cursor-not-allowed bg-slate-700/50 opacity-50" : ""}`}
                                disabled={isDisabled}
                                title={
                                  isDisabled
                                    ? "Disabled - using data from selected place"
                                    : undefined
                                }
                              />
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  {/* Action Buttons - Absolutely positioned on the right */}
                  <div className="absolute right-0 bottom-0 flex flex-col gap-0.5">
                    {/* Move Up Button */}
                    <button
                      type="button"
                      onClick={() => moveItemUp(index)}
                      disabled={index === 0}
                      className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title={index === 0 ? "Already at top" : "Move up"}
                    >
                      <ChevronUp size={16} />
                    </button>
                    {/* Move Down Button */}
                    <button
                      type="button"
                      onClick={() => moveItemDown(index)}
                      disabled={index === items.length - 1}
                      className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title={
                        index === items.length - 1
                          ? "Already at bottom"
                          : "Move down"
                      }
                    >
                      <ChevronDown size={16} />
                    </button>
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded p-1 text-red-400 transition-colors hover:bg-red-900/20 hover:text-red-300"
                      title={`Remove ${title.toLowerCase().slice(0, -1)}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add Button - After Events List */}
        {items.length > 0 && (
          <div className="text-center">
            <button
              type="button"
              onClick={addItem}
              className="mx-auto flex items-center gap-2 rounded bg-purple-900/50 px-4 py-2 text-sm text-purple-200 transition-colors hover:bg-purple-900/70"
            >
              <Plus size={16} />
              {addButtonText}
            </button>
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
              className="text-sm text-purple-900/60 transition-colors hover:text-purple-900/80"
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
