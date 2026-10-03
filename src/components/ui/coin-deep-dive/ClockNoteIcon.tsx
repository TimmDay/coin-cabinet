import type { ClockNoteLinkKind } from "~/types/api"

type ClockNoteIconProps = {
  /** What the note links to; null for a note of its own. */
  kind: ClockNoteLinkKind | null
}

const LABELS: Record<ClockNoteLinkKind, string> = {
  device: "Coin device",
  deity: "Deity",
  place: "Place",
  person: "Person",
  mint: "Mint",
  artifact: "Artifact",
}

/** The line drawn for each kind, in a 24 by 24 box. */
const SHAPES: Record<ClockNoteLinkKind, React.ReactNode> = {
  // A die stamp: a coin face with a diamond struck on it
  device: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" />
    </>
  ),
  // The sun's rays: a radiate crown
  deity: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  // A map pin
  place: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  // A head and shoulders
  person: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.6-4 3.2-6 7-6s6.4 2 7 6" />
    </>
  ),
  // A coin with a beaded rim
  mint: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5.5" strokeDasharray="1 2.6" />
    </>
  ),
  // A column, for something kept in a museum
  artifact: (
    <>
      <path d="M5 20h14M6.5 17h11M8 17V8m8 9V8M5.5 8h13M7 5h10l1.5 3h-13Z" />
    </>
  ),
}

/**
 * The icon in a clock note's circle. It comes from what the note links to, so
 * a note for a device looks different from one for a deity or a place. A note
 * of its own gets a small dot.
 */
export function ClockNoteIcon({ kind }: ClockNoteIconProps) {
  const label = kind ? LABELS[kind] : undefined

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:h-5 sm:w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-kind={kind ?? "own"}
    >
      {label && <title>{label}</title>}
      {kind ? (
        SHAPES[kind]
      ) : (
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      )}
    </svg>
  )
}
