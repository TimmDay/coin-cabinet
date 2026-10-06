"use client"

import type { ReactNode } from "react"
import { clickPoint, type ClickPoint } from "./CustomMarkerLayer"

/**
 * WCAG 2.2 asks for at least 24 by 24 CSS pixels of target (SC 2.5.8). The
 * marks themselves run from 7 to 12 pixels, which is the right size to look at
 * and the wrong size to hit, so the target is a transparent box around the
 * mark rather than the mark itself. 28 leaves a little margin over the minimum
 * without crowding neighbouring pins any more than necessary.
 */
const HIT_AREA_PX = 28

type MapPinProps = {
  /** What a screen reader announces, and what a pointer is aiming at. */
  label: string
  onActivate: (point: ClickPoint) => void
  /** The visible mark, centred inside the target. */
  children: ReactNode
}

/**
 * A map mark you can actually hit, and reach with a keyboard.
 *
 * Activation goes through `clickPoint`, so a key press opens the popup at the
 * middle of the mark rather than at the window's top left corner, which is
 * where a synthetic click reports itself.
 */
export function MapPin({ label, onActivate, children }: MapPinProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      className="focus-visible:ring-pin-cream flex cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
      style={{ width: HIT_AREA_PX, height: HIT_AREA_PX }}
      onClick={(event) => onActivate(clickPoint(event.nativeEvent))}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        event.currentTarget.click()
      }}
    >
      {children}
    </div>
  )
}
