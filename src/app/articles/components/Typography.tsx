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
    <p className={`mb-4 leading-relaxed text-slate-300 ${className}`}>
      {children}
    </p>
  )
}

/**
 * Lead - Lead paragraph (first paragraph after title)
 * Usage: <Lead>This is the opening paragraph...</Lead>
 */
export function Lead({ children, className = "" }: ParagraphProps) {
  return (
    <p
      className={`mb-6 text-lg leading-relaxed font-light text-slate-200 ${className}`}
    >
      {children}
    </p>
  )
}
