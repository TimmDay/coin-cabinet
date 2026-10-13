import { workText, type Citation } from "~/database/schema-citations"

type CitationListProps = {
  citations: Citation[] | undefined
  className?: string
  /** No "Sources" heading or rule above, and dimmer text: for a deep dive card. */
  plain?: boolean
}

/**
 * The sources behind a card or an event: each line is the Work (author and
 * title together), linked to where it can be read when there is a link, then
 * the place in it. What the citation supports shows on hover.
 */
export function CitationList({
  citations,
  className = "",
  plain = false,
}: CitationListProps) {
  if (!citations?.length) return null
  // field-muted is still 5.3:1 on a field, more on the darker page
  const workClass = plain ? "text-field-muted" : "text-moonlight"

  return (
    <div
      className={`${plain ? "pt-2" : "border-line border-t pt-4"} ${className}`}
    >
      {!plain && (
        <h4 className="text-field-muted mb-2 text-center text-xs tracking-widest uppercase">
          Sources
        </h4>
      )}
      <ul className="space-y-1 text-center text-sm">
        {citations.map((citation) => (
          <li key={citation.id} title={citation.note ?? undefined}>
            {citation.url ? (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${workClass} hover:text-moonlight-bright underline decoration-dotted underline-offset-4 transition-colors`}
              >
                {workText(citation)}
              </a>
            ) : (
              <span className={workClass}>{workText(citation)}</span>
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
