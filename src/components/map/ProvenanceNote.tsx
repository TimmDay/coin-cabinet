"use client"

import type { Corpus, Provenance } from "./jurisdictions"

type ProvenanceNoteProps = {
  provenance: Provenance | null
  corpus: Corpus | null
  className?: string
}

/**
 * Says where what is on screen came from, and admits when it is a
 * reconstruction. Derived from each Source's Coverage rather than written per
 * year, so correcting a Coverage range corrects every sentence that rests on
 * it.
 */
export function ProvenanceNote({
  provenance,
  corpus,
  className = "",
}: ProvenanceNoteProps) {
  if (!provenance || !corpus) return null

  const citable = provenance.sourceKeys
    .map((key) => ({ key, source: corpus.sources[key] }))
    .filter((entry) => entry.source && !("placeholder" in entry.source))

  return (
    <p
      className={`text-paper-ink-muted text-xs leading-relaxed ${className}`}
      aria-live="polite"
    >
      <span className={provenance.anyInferred ? "italic" : undefined}>
        {provenance.sentence}
      </span>

      {citable.length > 0 && (
        <>
          {" "}
          <span className="whitespace-nowrap">
            {citable.map(({ key, source }, index) => (
              <span key={key}>
                {index > 0 && " · "}
                {source?.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {source.licence ?? "source"}
                  </a>
                ) : (
                  (source?.licence ?? "source")
                )}
              </span>
            ))}
          </span>
        </>
      )}
    </p>
  )
}
