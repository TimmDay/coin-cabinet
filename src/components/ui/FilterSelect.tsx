"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FILTER_CONTROL_CLASSES } from "./filter-styles"

type FilterSelectProps = {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  placeholder: string
  label: string
}

const OPTION_CLASSES =
  "w-full px-4 py-2.5 text-left text-base focus-visible:bg-line/60 focus-visible:outline-none"

/**
 * A select built as a disclosure: a button that shows the current choice and
 * opens a list of buttons. Escape closes it and returns focus to the button,
 * and so does a click elsewhere or focus moving away. The button's name
 * includes the current value ("Denomination: Denarius") so a screen reader
 * announces both the filter and its state.
 */
export function FilterSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  label,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setIsOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1"
      onBlur={(event) => {
        if (
          !containerRef.current?.contains(event.relatedTarget as Node | null)
        ) {
          setIsOpen(false)
        }
      }}
    >
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`${FILTER_CONTROL_CLASSES} text-left`}
      >
        <span className="sr-only">
          {label}
          {selectedOption ? ": " : ", none selected"}
        </span>
        <span
          aria-hidden={!selectedOption}
          className={`block truncate ${selectedOption ? "text-ink" : "text-field-muted"}`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
      </button>
      <ChevronDown
        className={`text-field-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        aria-hidden="true"
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="bg-field border-line z-dropdown absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border shadow-lg">
          <button
            type="button"
            aria-current={!value ? "true" : undefined}
            className={`${OPTION_CLASSES} ${
              !value
                ? "bg-line text-ink"
                : "text-field-muted hover:bg-line/50 hover:text-ink"
            }`}
            onClick={() => handleSelect("")}
          >
            None selected
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-current={value === option.value ? "true" : undefined}
              className={`${OPTION_CLASSES} ${
                value === option.value
                  ? "bg-line text-ink"
                  : "text-ink hover:bg-line/50"
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
