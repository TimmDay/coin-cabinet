import type { ReactNode } from "react"

type ParagraphProps = {
  children: ReactNode
  className?: string
}

/**
 * P - Standard paragraph with article styling
 * Usage: <P>Your paragraph content here...</P>
 */
export function P({ children, className = "" }: ParagraphProps) {
  return (
    <p className={`text-ink mb-4 leading-relaxed ${className}`}>{children}</p>
  )
}

/**
 * Lead - Lead paragraph (first paragraph after title)
 * Usage: <Lead>This is the opening paragraph...</Lead>
 */
export function Lead({ children, className = "" }: ParagraphProps) {
  return (
    <p
      className={`text-ink mb-6 text-lg leading-relaxed font-light ${className}`}
    >
      {children}
    </p>
  )
}
