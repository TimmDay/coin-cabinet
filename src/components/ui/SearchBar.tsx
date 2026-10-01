"use client"

import { X } from "lucide-react"
import { useRef } from "react"
import { FILTER_CONTROL_CLASSES } from "./filter-styles"
import { IconButton } from "./IconButton"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  /** Accessible name for the search box (default: "Search coins") */
  label?: string
}

export function SearchBar({
  value,
  onChange,
  className = "",
  label = "Search coins",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder={label}
        className={FILTER_CONTROL_CLASSES}
      />
      {value ? (
        // Once there is text, the magnifier becomes a clear button. It is a
        // real button (32px target) and hands focus back to the box.
        <IconButton
          icon={X}
          iconSize="sm"
          variant="ghost"
          onClick={() => {
            onChange("")
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 -translate-y-1/2"
        />
      ) : (
        <svg
          className="text-field-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      )}
    </div>
  )
}
