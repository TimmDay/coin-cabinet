import CloudinaryImage from "~/components/CloudinaryImage"
import { cn } from "~/lib/utils"
import type { ClockNote } from "~/types/api"
import { ClockNoteIcon } from "./ClockNoteIcon"
import { TipIcon } from "./TipIcon"

/**
 * Which positions hang above or below the coin and so need room there.
 * 11, 12 and 1 clear the top edge, 5, 6 and 7 the bottom edge. The others sit
 * beside the coin.
 */
const TOP_POSITIONS = [11, 12, 1]
const BOTTOM_POSITIONS = [5, 6, 7]

/** Whether any of these notes needs room above and/or below its coin. */
export function clockNoteRoom(notes: ClockNote[]) {
  return {
    top: notes.some((n) => TOP_POSITIONS.includes(n.position)),
    bottom: notes.some((n) => BOTTOM_POSITIONS.includes(n.position)),
  }
}

/**
 * Where a clock position sits: on the coin's rim (half the box) plus a fixed
 * clearance of a button radius (22px) and a small gap, so a button never
 * overlaps a coin that fills its box.
 */
// A button radius plus a small gap. Set per breakpoint with --clock-gap below,
// because the buttons are smaller on phones.
const CLEARANCE = "var(--clock-gap)"

function clockOffset(position: number) {
  const angle = ((position % 12) * 30 * Math.PI) / 180
  const sin = Math.sin(angle).toFixed(4)
  const cos = Math.cos(angle).toFixed(4)
  return {
    left: `calc(50% + (50% + ${CLEARANCE}) * ${sin})`,
    top: `calc(50% - (50% + ${CLEARANCE}) * ${cos})`,
  }
}

// Each placement is relative to the button, and every one opens over the coin.
const UNDER = "" // below, centred (TipIcon's default)
const UNDER_LEFT = "left-auto right-0 translate-x-0"
const UNDER_RIGHT = "left-0 translate-x-0"
const ABOVE = "top-auto bottom-full mt-0 mb-2"
const ABOVE_LEFT = cn(ABOVE, UNDER_LEFT)
const ABOVE_RIGHT = cn(ABOVE, UNDER_RIGHT)
const BESIDE = "top-1/2 mt-0 -translate-y-1/2"
const LEFT_OF = cn(BESIDE, "right-full left-auto mr-2 translate-x-0")
const RIGHT_OF = cn(BESIDE, "left-full ml-2 translate-x-0")

/** Where the popover opens, by clock position. */
const PLACEMENT: Record<number, string> = {
  12: UNDER,
  1: UNDER_LEFT,
  2: UNDER_LEFT,
  3: LEFT_OF,
  4: ABOVE_LEFT,
  5: ABOVE_LEFT,
  6: ABOVE,
  7: ABOVE_RIGHT,
  8: ABOVE_RIGHT,
  9: RIGHT_OF,
  10: UNDER_RIGHT,
  11: UNDER_RIGHT,
}

function popoverPlacement(position: number) {
  return PLACEMENT[position === 0 ? 12 : position % 12] ?? UNDER
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
          icon={<ClockNoteIcon kind={note.linkKind} />}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 [--clock-gap:24px] sm:[--clock-gap:33px]"
          style={clockOffset(note.position)}
          popoverClassName={cn(
            "w-72 px-7 text-left text-base sm:w-84",
            popoverPlacement(note.position),
          )}
        >
          {note.title && (
            <span className="font-display text-bronze-light mb-4 block text-center text-lg tracking-widest uppercase">
              {note.title}
            </span>
          )}
          {note.imageUrl && (
            <span className="mb-3 flex h-40 items-center justify-center overflow-hidden rounded">
              <CloudinaryImage
                src={note.imageUrl}
                alt={note.title ?? ""}
                width={480}
                height={320}
              />
            </span>
          )}
          {note.imageUrl && note.imageCredit && (
            <span className="text-moonlight/80 -mt-2 mb-3 block text-center text-xs">
              {note.imageCredit}
            </span>
          )}
          {note.body}
          {note.linkUrl && (
            <a
              href={note.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-moonlight-bright hover:text-ink mt-2 block underline underline-offset-2"
            >
              {note.linkLabel ?? "Learn more"}
            </a>
          )}
        </TipIcon>
      ))}
    </>
  )
}
