import type { ReactNode } from "react"

type HeadingProps = {
  children: ReactNode
  className?: string
}

/**
 * H1 - Main article title (typically not used in content as layout handles page title)
 */
export function H1({ children, className = "" }: HeadingProps) {
  return (
    <h1 className={`mt-12 mb-6 text-3xl font-bold text-slate-100 ${className}`}>
      {children}
    </h1>
  )
}

/**
 * H2 - Major section headings
 * Usage: <H2>The Joint Rule</H2>
 */
export function H2({ children, className = "" }: HeadingProps) {
  return (
    <h2
      className={`mt-10 mb-4 text-2xl font-semibold text-slate-200 ${className}`}
    >
      {children}
    </h2>
  )
}

/**
 * H3 - Subsection headings
 * Usage: <H3>Political Maneuvering</H3>
 */
export function H3({ children, className = "" }: HeadingProps) {
  return (
    <h3 className={`mt-8 mb-3 text-xl font-medium text-slate-300 ${className}`}>
      {children}
    </h3>
  )
}

/**
 * H4 - Minor subsection headings (if needed)
 */
export function H4({ children, className = "" }: HeadingProps) {
  return (
    <h4 className={`mt-6 mb-2 text-lg font-medium text-slate-400 ${className}`}>
      {children}
    </h4>
  )
}
