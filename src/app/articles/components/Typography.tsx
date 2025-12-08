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
    <p className={`text-slate-300 leading-relaxed mb-4 ${className}`}>
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
    <p className={`text-lg text-slate-200 leading-relaxed mb-6 font-light ${className}`}>
      {children}
    </p>
  )
}