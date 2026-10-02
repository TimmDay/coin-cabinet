import { cn } from "~/lib/utils"
import type { ClockNote } from "~/types/api"
import { TipIcon } from "./TipIcon"

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
          interactive={note.linkUrl !== null}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={clockOffset(note.position)}
          popoverClassName={cn(
            "w-72 text-left sm:w-84",
            popoverPlacement(note.position),
          )}
        >
          {note.title && (
            <span className="font-display mb-1 block text-xs tracking-widest uppercase">
              {note.title}
            </span>
          )}
          {note.body}
          {note.linkUrl && (
            <a
              href={note.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-moonlight hover:text-moonlight-bright mt-2 block underline underline-offset-2"
            >
              {note.linkLabel ?? "Learn more"}
            </a>
          )}
        </TipIcon>
      ))}
    </>
  )
}
