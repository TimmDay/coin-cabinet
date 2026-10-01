"use client"

import { Calendar, X } from "lucide-react"
import { useRef } from "react"
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
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`year-input ${FILTER_CONTROL_CLASSES}`}
      />
      {value ? (
        // With a year entered, the calendar becomes a clear button (a real
        // button, 32px target) that hands focus back to the box.
        <button
          type="button"
          onClick={() => {
            onChange("")
            inputRef.current?.focus()
          }}
          aria-label={`Clear ${label}`}
          className="text-field-muted hover:text-ink focus-visible:ring-moonlight/70 absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <Calendar
          className="text-field-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
