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
      className={`border-bronze bg-dusk text-ink my-6 border-l-4 py-4 pl-6 italic ${className}`}
    >
      <div className="mb-2 text-lg leading-relaxed">"{children}"</div>
      {(author || source) && (
        <cite className="text-ink-soft text-sm not-italic">
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
    info: "border-bronze bg-dusk text-ink",
    warning: "border-amber-500/70 bg-amber-950/30 text-amber-100",
    success: "border-emerald-600/70 bg-emerald-950/30 text-emerald-100",
    error: "border-red-600/70 bg-red-950/30 text-red-100",
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
        <div className="bg-dusk-edge absolute top-0 bottom-0 left-4 w-0.5"></div>

        {events.map((event, index) => (
          <div key={index} className="relative mb-6 flex items-start last:mb-0">
            {/* Timeline dot */}
            <div className="bg-bronze text-night relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {index + 1}
            </div>

            {/* Event content */}
            <div className="ml-4 flex-1">
              <div className="text-ink-soft mb-1 text-sm">{event.date}</div>
              <div className="text-ink mb-2 text-lg font-medium">
                {event.title}
              </div>
              <div className="text-ink text-sm leading-relaxed">
                {event.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
