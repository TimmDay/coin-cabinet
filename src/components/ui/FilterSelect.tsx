"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type FilterSelectProps = {
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  placeholder: string
  label: string
}

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

  const selectedOption = options.find((opt) => opt.value === value)

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-full border border-slate-700/30 bg-slate-700/50 py-2 pr-10 pl-4 text-left text-sm backdrop-blur-sm transition-colors duration-200 focus:border-slate-500 focus:outline-none"
      >
        <span className={selectedOption ? "text-slate-200" : "text-slate-500"}>
          {selectedOption?.label ?? placeholder}
        </span>
      </button>
      <ChevronDown
        className={`pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        aria-hidden="true"
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-700/30 bg-slate-800 shadow-lg">
          {/* None selected option */}
          <button
            type="button"
            className={`w-full px-4 py-2 text-left text-sm focus:outline-none ${
              !value
                ? "bg-slate-700 text-slate-200"
                : "text-slate-400 hover:bg-slate-700/50"
            }`}
            onClick={() => handleSelect("")}
          >
            None selected
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full px-4 py-2 text-left text-sm text-slate-200 focus:outline-none ${
                value === option.value
                  ? "bg-slate-700"
                  : "hover:bg-slate-700/50"
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
