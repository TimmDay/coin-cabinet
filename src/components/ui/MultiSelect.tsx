import { useEffect, useRef, useState } from "react"
import type { UseFormSetValue, UseFormWatch } from "react-hook-form"

type MultiSelectProps<T extends Record<string, any>> = {
  options: { value: string; label: string }[]
  setValue: UseFormSetValue<T>
  watch: UseFormWatch<T>
  fieldName: keyof T
  className?: string
  placeholder?: string
  error?: string
}

export function MultiSelect<T extends Record<string, any>>({
  options,
  setValue,
  watch,
  fieldName,
  className,
  placeholder = "Select options...",
  error,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const selectedValues = (watch(fieldName as any) as string[]) ?? []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else if (focusedIndex >= 0) {
          toggleOption(options[focusedIndex]?.value ?? "")
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        inputRef.current?.focus()
        break
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          const nextIndex =
            focusedIndex < options.length - 1 ? focusedIndex + 1 : 0
          setFocusedIndex(nextIndex)
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(options.length - 1)
        } else {
          const prevIndex =
            focusedIndex > 0 ? focusedIndex - 1 : options.length - 1
          setFocusedIndex(prevIndex)
        }
        break
      case "Tab":
        if (isOpen) {
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
    }
  }

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const listbox = document.getElementById("multiselect-listbox")
      const focusedItem = listbox?.children[focusedIndex] as HTMLElement
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: "nearest" })
      }
    }
  }, [focusedIndex, isOpen])

  const toggleOption = (value: string) => {
    const currentValues = (selectedValues as string[]) || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value]

    setValue(fieldName as any, newValues as any, { shouldValidate: true })
  }

  const removeValue = (valueToRemove: string) => {
    const currentValues = (selectedValues as string[]) || []
    const newValues = currentValues.filter((v: string) => v !== valueToRemove)
    setValue(fieldName as any, newValues as any, { shouldValidate: true })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main input area */}
      <div
        ref={inputRef}
        className={`${className} flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1 p-2 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="multiselect-listbox"
        aria-label="Select sets"
      >
        {/* Selected pills */}
        {(selectedValues as string[])?.map((value: string) => {
          const option = options.find((opt) => opt.value === value)
          return (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm text-amber-800"
            >
              {option?.label ?? value}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeValue(value)
                }}
                className="rounded-full p-0.5 transition-colors hover:bg-amber-200"
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
              </button>
            </span>
          )
        })}

        {/* Placeholder text */}
        {(!selectedValues || (selectedValues as string[]).length === 0) && (
          <span className="text-slate-400">{placeholder}</span>
        )}

        {/* Dropdown arrow */}
        <div className="ml-auto">
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-600 bg-slate-800 shadow-lg"
          role="listbox"
          id="multiselect-listbox"
          aria-label="Set options"
        >
          {options.map((option, index) => {
            const isSelected =
              (selectedValues as string[])?.includes(option.value) ?? false
            const isFocused = index === focusedIndex
            return (
              <div
                key={option.value}
                className={`cursor-pointer bg-slate-800 px-3 py-2 transition-colors ${
                  isFocused ? "!bg-slate-700" : "hover:!bg-slate-700/50"
                } ${
                  isSelected ? "!bg-amber-600 text-white" : "text-slate-200"
                }`}
                onClick={() => toggleOption(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg
                      className="h-4 w-4"
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
          })}
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
