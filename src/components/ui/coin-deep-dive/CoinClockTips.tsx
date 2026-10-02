import { cn } from "~/lib/utils"

export type ClockNote = {
  /** Clock position, 1 to 12 (12 is straight up, 3 is right). */
  position: number
  title?: string | null
  body: string
}

// TEMPORARY: hardcoded demo notes. Delete once notes come from the database
// (docs/COIN_CLOCK_NOTES_PLAN.md, step 6).
export const DEMO_CLOCK_NOTES: ClockNote[] = [
  { position: 12, title: "Demo", body: "A note at twelve o'clock." },
  { position: 2, title: "Demo", body: "A note at two o'clock." },
  { position: 4, title: "Demo", body: "A note at four o'clock." },
  { position: 6, title: "Demo", body: "A note at six o'clock." },
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
 * Which way the tooltip opens. Buttons on the right half open leftward and
 * buttons on the left half open rightward, so a tooltip never runs off the
 * edge of the page. 12 and 6 are centred.
 */
function tooltipAlign(position: number) {
  const hour = position % 12
  if (hour === 0 || hour === 6) return "left-1/2 -translate-x-1/2"
  return hour < 6 ? "right-0" : "left-0"
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
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-within:z-30 hover:z-30"
          style={clockOffset(note.position)}
        >
          <button
            type="button"
            aria-label={note.title ?? `Note at ${note.position} o'clock`}
            className="border-moonlight/70 text-moonlight hover:border-moonlight focus-visible:border-moonlight focus-visible:ring-moonlight/70 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-dashed bg-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          />
          <div
            role="tooltip"
            className={cn(
              "border-line bg-field text-moonlight-bright pointer-events-none absolute top-full z-20 mt-2 hidden w-56 rounded-md border px-3 py-2 text-left text-sm group-focus-within:block group-hover:block",
              tooltipAlign(note.position),
            )}
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
