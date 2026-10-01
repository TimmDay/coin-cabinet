"use client"

import { Calendar, X } from "lucide-react"
import { useRef } from "react"
import { FILTER_CONTROL_CLASSES } from "./filter-styles"
import { IconButton } from "./IconButton"

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
        <IconButton
          icon={X}
          iconSize="sm"
          variant="ghost"
          onClick={() => {
            onChange("")
            inputRef.current?.focus()
          }}
          aria-label={`Clear ${label}`}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        />
      ) : (
        <Calendar
          className="text-field-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
