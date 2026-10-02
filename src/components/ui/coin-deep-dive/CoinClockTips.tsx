export type ClockNote = {
  /** Clock position, 1 to 12 (12 is straight up, 3 is right). */
  position: number
  title?: string | null
  body: string
}

// TEMPORARY: hardcoded demo notes. Delete once notes come from the database
// (docs/COIN_CLOCK_NOTES_PLAN.md, step 6).
export const DEMO_CLOCK_NOTES: ClockNote[] = [
  { position: 2, title: "Demo", body: "A note at two o'clock." },
  { position: 4, title: "Demo", body: "A note at four o'clock." },
  { position: 9, title: "Demo", body: "A note at nine o'clock." },
  { position: 10, title: "Demo", body: "A note at ten o'clock." },
]

/**
 * Where a clock position sits: on the coin's rim (half the box) plus a fixed
 * clearance of a button radius (22px) and a small gap, so a button never
 * overlaps a coin that fills its box.
 */
const CLEARANCE = "33px"

function clockOffset(position: number) {
  const angle = ((position % 12) * 30 * Math.PI) / 180
  const sin = Math.sin(angle).toFixed(4)
  const cos = Math.cos(angle).toFixed(4)
  return {
    left: `calc(50% + (50% + ${CLEARANCE}) * ${sin})`,
    top: `calc(50% - (50% + ${CLEARANCE}) * ${cos})`,
  }
}

/**
 * Small circular note buttons placed around a coin image at clock positions.
 * Render inside a `relative` square that holds the coin. Muted on purpose:
 * a dashed blueprint outline that brightens on hover and focus.
 */
export function CoinClockTips({ notes }: { notes: ClockNote[] }) {
  if (notes.length === 0) return null

  return (
    <>
      {notes.map((note) => (
        <div
          key={note.position}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={clockOffset(note.position)}
        >
          <button
            type="button"
            aria-label={note.title ?? `Note at ${note.position} o'clock`}
            className="border-moonlight/70 text-moonlight hover:border-moonlight focus-visible:border-moonlight focus-visible:ring-moonlight/70 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-dashed bg-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          />
          <div
            role="tooltip"
            className="border-line bg-field text-moonlight-bright pointer-events-none absolute top-full left-1/2 z-20 mt-2 hidden w-56 -translate-x-1/2 rounded-md border px-3 py-2 text-left text-sm group-focus-within:block group-hover:block"
          >
            {note.title && (
              <p className="font-display mb-1 text-xs tracking-widest uppercase">
                {note.title}
              </p>
            )}
            <p>{note.body}</p>
          </div>
        </div>
      ))}
    </>
  )
}
