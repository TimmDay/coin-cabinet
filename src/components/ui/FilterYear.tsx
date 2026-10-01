"use client"

import { Calendar } from "lucide-react"
import { FILTER_CONTROL_CLASSES } from "./filter-styles"

type FilterYearProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}

export function FilterYear({
  id,
  value,
  onChange,
  placeholder,
  label,
}: FilterYearProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`year-input ${FILTER_CONTROL_CLASSES}`}
      />
      <button
        type="button"
        onClick={() => onChange("")}
        className="text-moonlight hover:text-ink focus-visible:ring-moonlight/70 absolute top-1/2 right-3 -translate-y-1/2 rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Clear ${label}`}
      >
        <Calendar className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
