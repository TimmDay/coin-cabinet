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
export function Quote({
  children,
  author,
  source,
  className = "",
}: QuoteProps) {
  return (
    <blockquote
      className={`border-primary my-6 border-l-4 bg-slate-800/30 py-4 pl-6 text-slate-200 italic ${className}`}
    >
      <div className="mb-2 text-lg leading-relaxed">"{children}"</div>
      {(author || source) && (
        <cite className="text-sm text-slate-400 not-italic">
          — {author}
          {source && `, ${source}`}
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
export function Callout({
  children,
  type = "info",
  title,
  className = "",
}: CalloutProps) {
  const styles = {
    info: "border-blue-500 bg-blue-900/20 text-blue-100",
    warning: "border-yellow-500 bg-yellow-900/20 text-yellow-100",
    success: "border-green-500 bg-green-900/20 text-green-100",
    error: "border-red-500 bg-red-900/20 text-red-100",
  }

  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✅",
    error: "❌",
  }

  return (
    <div
      className={`my-6 rounded-r-lg border-l-4 p-4 ${styles[type]} ${className}`}
    >
      {title && (
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <span>{icons[type]}</span>
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
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
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-600"></div>

        {events.map((event, index) => (
          <div key={index} className="relative mb-6 flex items-start last:mb-0">
            {/* Timeline dot */}
            <div className="bg-primary relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-slate-900">
              {index + 1}
            </div>

            {/* Event content */}
            <div className="ml-4 flex-1">
              <div className="mb-1 text-sm text-slate-400">{event.date}</div>
              <div className="mb-2 text-lg font-medium text-slate-200">
                {event.title}
              </div>
              <div className="text-sm leading-relaxed text-slate-300">
                {event.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
