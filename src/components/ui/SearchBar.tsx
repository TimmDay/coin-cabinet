type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBar({ value, onChange, className = "" }: SearchBarProps) {
  return (
    <div className={`relative w-80 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-slate-700/30 bg-slate-700/50 py-2 pr-10 pl-4 text-sm text-slate-200 shadow-sm backdrop-blur-sm transition-all focus:border-slate-600/50 focus:ring-2 focus:ring-slate-700/20 focus:outline-none"
      />
      <svg
        className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}
