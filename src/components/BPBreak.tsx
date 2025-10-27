type BPBreakProps = {
  /** Height of the break in pixels, defaults to 0 */
  height?: number
  /** Whether to show the border line, defaults to true */
  border?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Creates a horizontal break in text flow with optional border line
 * Clears floated elements and creates vertical space
 */
export function BPBreak({
  height = 0,
  border = true,
  className = "",
}: BPBreakProps) {
  // Map common heights to Tailwind classes
  const getHeightClass = (h: number) => {
    if (h === 0) return ""
    if (h <= 16) return "h-4"
    if (h <= 24) return "h-6"
    if (h <= 32) return "h-8"
    if (h <= 48) return "h-12"
    if (h <= 64) return "h-16"
    if (h <= 96) return "h-24"
    if (h <= 128) return "h-32"
    return "h-48" // fallback for very large heights
  }

  const heightClass = getHeightClass(height)

  return (
    <div
      className={`clear-both flex w-full items-center justify-center ${heightClass} ${className}`}
    >
      {border && (
        <div className="h-px w-[300px] bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
      )}
    </div>
  )
}
