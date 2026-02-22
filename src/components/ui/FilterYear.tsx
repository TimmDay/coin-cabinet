"use client"

import { Calendar } from "lucide-react"

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
    <div className="relative flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="year-input w-full rounded-full border border-slate-700/30 bg-slate-700/50 py-2 pr-10 pl-4 text-sm text-slate-200 placeholder-slate-500 backdrop-blur-sm transition-colors duration-200 focus:border-slate-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
        aria-label={`Clear ${label}`}
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  )
}
