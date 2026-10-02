import { cn } from "~/lib/utils"
import { TipIcon } from "./TipIcon"

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
 * Where the popover opens. Buttons on the right half open leftward and
 * buttons on the left half open rightward, so a popover never runs off the
 * edge of the page. 12 and 6 are centred, and 6 opens upward so the popover
 * doesn't cover the legend below the coin.
 */
function popoverPlacement(position: number) {
  const hour = position % 12
  if (hour === 6) return "top-auto bottom-full mt-0 mb-2"
  if (hour === 0) return ""
  return cn("left-auto translate-x-0", hour < 6 ? "right-0" : "left-0")
}

/**
 * Small circular note buttons placed around a coin image at clock positions.
 * Render inside a `relative` square that holds the coin.
 */
export function CoinClockTips({ notes }: { notes: ClockNote[] }) {
  if (notes.length === 0) return null

  return (
    <>
      {notes.map((note) => (
        <TipIcon
          key={note.position}
          size="md"
          label={note.title ?? `Note at ${note.position} o'clock`}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={clockOffset(note.position)}
          popoverClassName={cn(
            "w-56 text-left",
            popoverPlacement(note.position),
          )}
        >
          {note.title && (
            <span className="font-display mb-1 block text-xs tracking-widest uppercase">
              {note.title}
            </span>
          )}
          {note.body}
        </TipIcon>
      ))}
    </>
  )
}
