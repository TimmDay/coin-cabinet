import type { ReactNode } from "react"

type HeadingProps = {
  children: ReactNode
  className?: string
}

/**
 * H2 - Major section headings
 * Usage: <H2>The Joint Rule</H2>
 */
export function H2({ children, className = "" }: HeadingProps) {
  return (
    <h2 className={`mt-10 mb-4 text-2xl font-semibold ${className}`}>
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
    <h3 className={`mt-8 mb-3 text-xl font-medium ${className}`}>{children}</h3>
  )
}
