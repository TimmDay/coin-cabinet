import { forwardRef } from "react"

type SelectOption = {
  value: string
  label: string
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly SelectOption[]
  placeholder?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, error, className, disabled, ...props }, ref) => {
    const baseClass = disabled
      ? "w-full pl-3 pr-10 py-2 rounded border border-slate-600 text-gray-500 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none appearance-none opacity-50 cursor-not-allowed bg-slate-800/50"
      : "w-full pl-3 pr-10 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none appearance-none transition-colors"

    return (
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClass} ${className ?? ""}`}
          disabled={disabled}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className={`h-4 w-4 transition-colors ${disabled ? "text-gray-600" : "text-slate-400"}`}
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

        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  },
)

Select.displayName = "Select"
