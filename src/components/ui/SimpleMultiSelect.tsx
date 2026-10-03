"use client"

import { useEffect, useRef, useState } from "react"

type SimpleMultiSelectProps = {
  options: { value: string; label: string }[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  className?: string
  placeholder?: string
  maxHeight?: string
  isLoading?: boolean
}

export function SimpleMultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  className = "w-full rounded-md border border-paper-edge bg-paper-raised text-paper-ink",
  placeholder = "Select options...",
  maxHeight = "max-h-60",
  isLoading = false,
}: SimpleMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          toggleOption(filteredOptions[focusedIndex].value)
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        setSearchTerm("")
        inputRef.current?.focus()
        break
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          const nextIndex =
            focusedIndex < filteredOptions.length - 1 ? focusedIndex + 1 : 0
          setFocusedIndex(nextIndex)
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(filteredOptions.length - 1)
        } else {
          const prevIndex =
            focusedIndex > 0 ? focusedIndex - 1 : filteredOptions.length - 1
          setFocusedIndex(prevIndex)
        }
        break
      case "Tab":
        if (isOpen) {
          setIsOpen(false)
          setFocusedIndex(-1)
          setSearchTerm("")
        }
        break
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
    setFocusedIndex(0) // Always focus first filtered item
  }

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && filteredOptions.length > 0) {
      const listbox = document.getElementById("simple-multiselect-listbox")
      const focusedItem = listbox?.children[focusedIndex] as HTMLElement
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: "nearest" })
      }
    }
  }, [focusedIndex, isOpen, filteredOptions.length])

  const toggleOption = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    onSelectionChange(newValues)
  }

  const removeValue = (valueToRemove: string) => {
    const newValues = selectedValues.filter((v) => v !== valueToRemove)
    onSelectionChange(newValues)
  }

  if (isLoading) {
    return (
      <div className="border-paper-edge bg-paper-raised h-[42px] w-full animate-pulse rounded-md border" />
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main input area */}
      <div
        ref={containerRef}
        className={`${className} focus-within:border-map-label focus-within:ring-map-label/40 flex min-h-[42px] cursor-text flex-wrap items-center gap-1 p-2 focus-within:ring-2`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected pills */}
        {selectedValues.map((value) => {
          const option = options.find((opt) => opt.value === value)
          return (
            <span
              key={value}
              className="border-paper-edge bg-paper text-paper-ink inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm"
            >
              {option?.label ?? value}
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  removeValue(value)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    e.stopPropagation()
                    removeValue(value)
                  }
                }}
                className="hover:bg-paper-edge/40 cursor-pointer rounded-full p-0.5 transition-colors"
                role="button"
                tabIndex={0}
                aria-label={`Remove ${option?.label ?? value}`}
              >
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
          )
        })}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
          className="text-paper-ink placeholder:text-paper-ink-muted min-w-[120px] flex-1 bg-transparent outline-none"
          placeholder={selectedValues.length === 0 ? placeholder : "Search..."}
          onFocus={() => setIsOpen(true)}
        />

        {/* Dropdown arrow */}
        <div className="ml-auto">
          <svg
            className={`text-paper-ink-muted h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 ${maxHeight} border-paper-edge bg-paper-raised w-full overflow-auto rounded-md border shadow-xl`}
          role="listbox"
          id="simple-multiselect-listbox"
          aria-label="Options"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value)
              const isFocused = index === focusedIndex
              return (
                <div
                  key={option.value}
                  className={`cursor-pointer px-3 py-2 transition-colors ${
                    isFocused
                      ? "bg-paper text-paper-ink"
                      : isSelected
                        ? "bg-paper-edge/30 text-map-label"
                        : "bg-paper-raised text-paper-ink"
                  }`}
                  onClick={() => toggleOption(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {isSelected && (
                      <svg
                        className="text-map-label h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-paper-ink-muted px-3 py-2">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
