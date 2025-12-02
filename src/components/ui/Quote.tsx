"use client"

type QuoteProps = {
  quote: string
  attribution: string
  link?: string
}

export function Quote({ quote, attribution, link }: QuoteProps) {
  const handleClick = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer")
    }
  }

  const containerClasses = `
    text-center
    ${link ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
  `

  if (link) {
    return (
      <button
        className={`${containerClasses} w-full border-none bg-transparent p-0 text-left`}
        onClick={handleClick}
        aria-label={`Read more about this quote by ${attribution}`}
      >
        <blockquote className="mb-4 text-lg text-slate-300 italic">
          &quot;{quote}&quot;
        </blockquote>
        <cite className="text-sm text-slate-400 not-italic">
          — {attribution}
        </cite>
      </button>
    )
  }

  return (
    <div className={containerClasses}>
      <blockquote className="mb-4 text-lg text-slate-300 italic">
        &quot;{quote}&quot;
      </blockquote>
      <cite className="text-sm text-slate-400 not-italic">— {attribution}</cite>
    </div>
  )
}
