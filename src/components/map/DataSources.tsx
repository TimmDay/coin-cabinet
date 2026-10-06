"use client"

import { useEffect, useId, useRef, useState } from "react"
import { formatYear, type Corpus, type Provenance } from "./jurisdictions"

type DataSourcesProps = {
  provenance: Provenance | null
  corpus: Corpus | null
  /** The year the panel is describing, for its heading. */
  year: number
  className?: string
}

/**
 * Where the boundaries on screen came from, behind a button rather than spread
 * across the page.
 *
 * Contrast is deliberate, not inherited. This sits on the dark page surface,
 * where the paper ink tokens it used to borrow measured 2.55:1 against the
 * background, well under WCAG AA. The trigger wears `ink` on the surface and a
 * `ink-muted` border, since neither `line` (1.55:1) nor `surface-raised`
 * (1.11:1) clears the 3:1 a control's own boundary needs. The panel is a paper
 * card, where `paper-ink` reads at 11.37:1 and `paper-ink-muted` at 5.32:1.
 */
export function DataSources({
  provenance,
  corpus,
  year,
  className = "",
}: DataSourcesProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

  // Escape closes and returns focus; a click outside just closes. Non-modal on
  // purpose: this annotates the map rather than interrupting it, so the map
  // stays operable behind it.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      buttonRef.current?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (buttonRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!provenance || !corpus) return null

  const entries = provenance.sourceKeys
    .map((key) => ({ key, source: corpus.sources[key] }))
    .filter((entry) => entry.source !== undefined)

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="border-ink-muted text-ink hover:bg-surface-raised focus-visible:outline-ink inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs tracking-wider uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Data sources
        {provenance.anyInferred && (
          <>
            {/* Presence, not colour, carries the signal, so it still reads
                under any colour vision. The words go to screen readers. */}
            <span
              aria-hidden="true"
              className="bg-ink inline-block h-1.5 w-1.5 rounded-full"
            />
            <span className="sr-only">, includes reconstructed boundaries</span>
          </>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby={headingId}
          tabIndex={-1}
          className="border-paper-edge bg-paper text-paper-ink absolute bottom-full left-0 z-20 mb-2 max-h-[60vh] w-[min(34rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border p-4 shadow-xl focus-visible:outline-none"
        >
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 id={headingId} className="text-sm font-semibold">
              Data sources, {formatYear(year)}
            </h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              className="text-paper-ink-muted hover:text-paper-ink focus-visible:outline-paper-ink rounded text-xs underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Close
            </button>
          </div>

          <p className="text-paper-ink mb-4 text-sm leading-relaxed">
            {provenance.sentence}
          </p>

          <ul className="space-y-4">
            {entries.map(({ key, source }) => (
              <li key={key} className="border-paper-edge border-t pt-3">
                <h3 className="text-sm font-semibold">{source?.title}</h3>

                <dl className="mt-1 space-y-1 text-xs leading-relaxed">
                  {source?.licence && (
                    <div className="flex gap-2">
                      <dt className="text-paper-ink-muted shrink-0">Licence</dt>
                      <dd>
                        {source.licenceUrl ? (
                          <a
                            href={source.licenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-visible:outline-paper-ink underline"
                          >
                            {source.licence}
                          </a>
                        ) : (
                          source.licence
                        )}
                        {source.url && (
                          <>
                            {" · "}
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="focus-visible:outline-paper-ink underline"
                            >
                              source
                            </a>
                          </>
                        )}
                      </dd>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <dt className="text-paper-ink-muted shrink-0">Covers</dt>
                    <dd>
                      {source && source.coverage.from > source.coverage.to
                        ? "nothing: these dates are a placeholder, not scholarship"
                        : source &&
                          `${formatYear(source.coverage.from)} to ${formatYear(
                            source.coverage.to,
                          )}`}
                    </dd>
                  </div>

                  {source?.modified && (
                    <div className="flex gap-2">
                      <dt className="text-paper-ink-muted shrink-0">Changed</dt>
                      <dd>{source.modified}</dd>
                    </div>
                  )}
                </dl>

                {source?.defects && source.defects.length > 0 && (
                  <details className="mt-2 text-xs">
                    <summary className="text-paper-ink-muted hover:text-paper-ink focus-visible:outline-paper-ink cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2">
                      Known problems with this source ({source.defects.length})
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed">
                      {source.defects.map((defect) => (
                        <li key={defect}>{defect}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
