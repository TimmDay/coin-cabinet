import type { ReactNode } from "react"

type QuoteProps = {
  children: ReactNode
  author?: string
  source?: string
  className?: string
}

type CalloutProps = {
  children: ReactNode
  type?: "info" | "warning" | "success" | "error"
  title?: string
  className?: string
}

/**
 * Quote - For highlighted quotes and citations
 * Usage: 
 * <Quote author="Julius Caesar">Veni, vidi, vici</Quote>
 * <Quote author="Tacitus" source="Annals">They make a desert and call it peace</Quote>
 */
export function Quote({ children, author, source, className = "" }: QuoteProps) {
  return (
    <blockquote className={`border-l-4 border-primary pl-6 py-4 my-6 italic text-slate-200 bg-slate-800/30 ${className}`}>
      <div className="text-lg leading-relaxed mb-2">
        "{children}"
      </div>
      {(author || source) && (
        <cite className="text-sm text-slate-400 not-italic">
          — {author}{source && `, ${source}`}
        </cite>
      )}
    </blockquote>
  )
}

/**
 * Callout - For important notes, warnings, tips
 * Usage:
 * <Callout type="info" title="Historical Note">
 *   This coin was minted during the civil war period...
 * </Callout>
 */
export function Callout({ children, type = "info", title, className = "" }: CalloutProps) {
  const styles = {
    info: "border-blue-500 bg-blue-900/20 text-blue-100",
    warning: "border-yellow-500 bg-yellow-900/20 text-yellow-100", 
    success: "border-green-500 bg-green-900/20 text-green-100",
    error: "border-red-500 bg-red-900/20 text-red-100"
  }

  const icons = {
    info: "ℹ️",
    warning: "⚠️", 
    success: "✅",
    error: "❌"
  }

  return (
    <div className={`border-l-4 p-4 my-6 rounded-r-lg ${styles[type]} ${className}`}>
      {title && (
        <div className="font-semibold mb-2 flex items-center gap-2">
          <span>{icons[type]}</span>
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}

/**
 * Timeline - For chronological events
 * Usage:
 * <Timeline events={[
 *   { date: "211 CE", title: "Death of Septimius Severus", description: "..." },
 *   { date: "212 CE", title: "Murder of Geta", description: "..." }
 * ]} />
 */
type TimelineEvent = {
  date: string
  title: string
  description: string
}

type TimelineProps = {
  events: TimelineEvent[]
  className?: string
}

export function Timeline({ events, className = "" }: TimelineProps) {
  return (
    <div className={`my-8 ${className}`}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-600"></div>
        
        {events.map((event, index) => (
          <div key={index} className="relative flex items-start mb-6 last:mb-0">
            {/* Timeline dot */}
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-slate-900 relative z-10">
              {index + 1}
            </div>
            
            {/* Event content */}
            <div className="ml-4 flex-1">
              <div className="text-sm text-slate-400 mb-1">{event.date}</div>
              <div className="text-lg font-medium text-slate-200 mb-2">{event.title}</div>
              <div className="text-slate-300 text-sm leading-relaxed">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}