"use client"

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

const VIEWPORT_MARGIN = 8 // px kept clear between the popover and the screen's right edge

// A thin solid ring round a Roman numeral I, like the rim of a coin.
function CoinI() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px] select-none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="10.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fill="currentColor"
        fontSize="12"
        style={{ fontFamily: "var(--font-display)" }}
      >
        I
      </text>
    </svg>
  )
}

type QuipProps = {
  /** The aside itself. Shown in a popover when the icon is activated. */
  children: ReactNode
  /** Accessible name for the icon button (default: "More info") */
  label?: string
}

/**
 * A small "I" in a ring that reveals an aside in a popover, for little quips
 * inside running prose. Drop it inline, in place of the parenthetical:
 *
 *   <p>Coins were the first newspapers <Quip>or so I like to think</Quip>.</p>
 *
 * The popover always sits above the icon and extends to its right.
 *
 * Behaviour, for mouse, touch, keyboard and screen readers alike:
 * - a real <button>: Enter and Space toggle it, and the target is 24x24px
 * - hovering with a mouse shows it, and it stays while the pointer is over
 *   the icon or the popover (a transparent bridge covers the gap between
 *   them). Clicking pins it open so it survives the pointer leaving
 * - touch has no hover: a tap toggles it
 * - the popover is injected into an always-present role="status" region, so
 *   screen readers announce the text when it opens
 * - Escape dismisses it (returning focus to the icon if it was inside), as
 *   does a click or tap elsewhere or focus leaving
 * - it is never allowed off the right edge of the screen: it slides left
 *   just enough to fit
 */
export function Quip({ children, label = "More info" }: QuipProps) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || pinned
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLSpanElement>(null)

  const dismiss = useCallback(() => {
    setHovered(false)
    setPinned(false)
  }, [])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        dismiss()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (popoverRef.current?.contains(document.activeElement)) {
        buttonRef.current?.focus()
      }
      dismiss()
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, dismiss])

  // Keep the popover inside the viewport. Measured before paint, so there is
  // no flicker.
  useLayoutEffect(() => {
    const popover = popoverRef.current
    if (!open || !popover) return

    const rect = popover.getBoundingClientRect()
    const overflow = rect.right - (window.innerWidth - VIEWPORT_MARGIN)
    popover.style.transform = overflow > 0 ? `translateX(-${overflow}px)` : ""
  }, [open])

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block align-middle"
      // Mouse only: touch fires pointerenter on tap, which would fight the
      // click handler and close the popover straight after opening it.
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false)
      }}
      onBlur={(event) => {
        // Close when focus leaves the icon and its popover entirely.
        if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) {
          dismiss()
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setPinned((prev) => !prev)}
        aria-label={label}
        aria-expanded={open}
        className="text-bronze hover:text-bronze-light aria-expanded:text-bronze-light inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:outline-none"
      >
        <CoinI />
      </button>

      {/* Always mounted so the text is announced when it appears */}
      <span role="status" className="contents">
        {open && (
          // The outer span has bottom padding, not a margin, so the gap
          // between the icon and the visible box still counts as "over the
          // popover" and the pointer can cross it without closing it.
          // tabIndex keeps focus inside the wrapper when the text is clicked
          // or selected, so the blur handler above does not close it.
          <span
            ref={popoverRef}
            tabIndex={-1}
            className="z-tooltip absolute bottom-full left-1/2 block w-max max-w-[min(20rem,calc(100vw-2rem))] pb-2 focus:outline-none"
          >
            <span className="text-heading border-dusk-edge/70 bg-dusk/96 block rounded-lg border px-4 py-3 text-left text-lg leading-relaxed font-normal whitespace-normal shadow-lg backdrop-blur-sm">
              {children}
            </span>
          </span>
        )}
      </span>
    </span>
  )
}

// Matches a "{name}" placeholder.
const PLACEHOLDER = /\{(\w+)\}/g

/**
 * Turns each "{name}" placeholder in a plain string into a <Quip> showing
 * quips[name]. For copy kept as strings in a translations file, with the
 * asides stored beside it (e.g. quip1, quip2), so all the wording lives in
 * one place. In JSX, use <Quip> directly. A placeholder with no matching
 * entry is left as literal text so the mistake is visible on the page.
 */
export function withQuips(
  text: string,
  quips: Record<string, string>,
): ReactNode {
  const parts = text.split(PLACEHOLDER)
  // split() with one capture group alternates: text, name, text, name, ...
  return parts.map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>
    const quip = quips[part]
    return quip === undefined ? (
      <Fragment key={index}>{`{${part}}`}</Fragment>
    ) : (
      <Quip key={index}>{quip}</Quip>
    )
  })
}
