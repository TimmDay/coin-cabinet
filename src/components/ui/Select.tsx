"use client"

import { forwardRef, useEffect, useRef, useState } from "react"

type SelectOption = {
  value: string
  label: string
}

type SelectProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  options: readonly SelectOption[]
  placeholder?: string
  error?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      options,
      placeholder,
      error,
      className,
      disabled,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      () => options.find((opt) => opt.value === value) ?? null,
    )
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Update selected option when value prop changes
    useEffect(() => {
      const option = options.find((opt) => opt.value === value) ?? null
      setSelectedOption(option)
    }, [value, options])

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Scroll focused item into view
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && filteredOptions.length > 0) {
        const dropdown = containerRef.current?.querySelector('[role="listbox"]')
        const focusedItem = dropdown?.children[focusedIndex] as HTMLElement
        if (focusedItem) {
          focusedItem.scrollIntoView({ block: "nearest" })
        }
      }
    }, [focusedIndex, isOpen, filteredOptions.length])

    // Handle clicking outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
          setSearchTerm("")
          setFocusedIndex(-1)
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen])

    const handleInputClick = () => {
      if (!disabled) {
        setIsOpen(true)
        setSearchTerm("")
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        setSearchTerm(e.target.value)
        setIsOpen(true)
        setFocusedIndex(0) // Reset to first item when searching
      }
    }

    const handleOptionSelect = (option: SelectOption) => {
      setSelectedOption(option)
      setIsOpen(false)
      setSearchTerm("")

      // Create a synthetic event for react-hook-form compatibility
      if (onChange) {
        const syntheticEvent = {
          target: { value: option.value, name: props.name },
          currentTarget: { value: option.value, name: props.name },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === "Escape") {
        setIsOpen(false)
        setSearchTerm("")
        setFocusedIndex(-1)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          const nextIndex =
            focusedIndex < filteredOptions.length - 1 ? focusedIndex + 1 : 0
          setFocusedIndex(nextIndex)
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(filteredOptions.length - 1)
        } else {
          const prevIndex =
            focusedIndex > 0 ? focusedIndex - 1 : filteredOptions.length - 1
          setFocusedIndex(prevIndex)
        }
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionSelect(filteredOptions[focusedIndex])
        } else if (filteredOptions.length === 1 && filteredOptions[0]) {
          handleOptionSelect(filteredOptions[0])
        }
      } else if (e.key === "Tab") {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    const displayValue = isOpen ? searchTerm : (selectedOption?.label ?? "")
    const showPlaceholder = !isOpen && !selectedOption && !searchTerm

    const baseClass = disabled
      ? "w-full pl-3 pr-10 py-2 rounded border border-slate-600 text-gray-500 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none opacity-50 cursor-not-allowed bg-slate-800/50"
      : "w-full pl-3 pr-10 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors cursor-pointer"

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={ref ?? inputRef}
          type="text"
          className={`${baseClass} ${className ?? ""}`}
          disabled={disabled}
          value={displayValue}
          placeholder={showPlaceholder ? placeholder : ""}
          onClick={handleInputClick}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen ? "true" : "false"}
          aria-haspopup="menu"
          aria-controls="select-dropdown"
          {...props}
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className={`h-4 w-4 transition-all duration-200 ${
              disabled ? "text-gray-600" : "text-slate-400"
            } ${isOpen ? "rotate-180" : ""}`}
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

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            id="select-dropdown"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-600 bg-slate-800 shadow-lg"
            role="menu"
            aria-label="Select options"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = selectedOption?.value === option.value
                const isFocused = index === focusedIndex
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="menuitem"
                    className={`w-full px-3 py-2 text-left text-slate-200 focus:outline-none ${
                      isFocused
                        ? "bg-amber-600/20 text-amber-200"
                        : isSelected
                          ? "bg-slate-700"
                          : "hover:bg-slate-700"
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    {option.label}
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-2 text-slate-400">No options found</div>
            )}
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"
