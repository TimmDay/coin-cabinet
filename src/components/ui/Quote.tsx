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

  return (
    <div className={containerClasses} onClick={handleClick}>
      <blockquote className="mb-4 text-lg text-slate-300 italic">
        &quot;{quote}&quot;
      </blockquote>
      <cite className="text-sm text-slate-400 not-italic">— {attribution}</cite>
    </div>
  )
}
