import { workText, type Citation } from "~/database/schema-citations"

type CitationListProps = {
  citations: Citation[] | undefined
  className?: string
}

/**
 * The sources behind a card or an event: each line is the Work (author and
 * title together), linked to where it can be read when there is a link, then
 * the place in it. What the citation supports shows on hover.
 */
export function CitationList({ citations, className = "" }: CitationListProps) {
  if (!citations?.length) return null

  return (
    <div className={`border-line border-t pt-4 ${className}`}>
      <h4 className="text-field-muted mb-2 text-center text-xs tracking-widest uppercase">
        Sources
      </h4>
      <ul className="space-y-1 text-center text-sm">
        {citations.map((citation) => (
          <li key={citation.id} title={citation.note ?? undefined}>
            {citation.url ? (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-moonlight hover:text-moonlight-bright underline decoration-dotted underline-offset-4 transition-colors"
              >
                {workText(citation)}
              </a>
            ) : (
              <span className="text-moonlight">{workText(citation)}</span>
            )}
            {citation.locator && (
              <span className="text-field-muted"> {citation.locator}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
