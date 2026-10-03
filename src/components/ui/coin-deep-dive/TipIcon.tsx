"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { cn } from "~/lib/utils"

const sizeClasses = {
  sm: "h-[22px] w-[22px]",
  md: "h-8 w-8 sm:h-11 sm:w-11",
  lg: "h-10 w-10",
}

type TipIconProps = {
  size: keyof typeof sizeClasses
  /** The button's accessible name, e.g. "Show translation". */
  label: string
  /** What the popover shows. */
  children: ReactNode
  /** Positions the wrapper. Unpositioned, the popover anchors to the nearest `relative` ancestor. */
  className?: string
  style?: CSSProperties
  /** Placement and width of the popover. Defaults to below, centred. */
  popoverClassName?: string
  /** The popover holds its own buttons or links, so it is a group, not a tooltip. */
  interactive?: boolean
  /** Drawn inside the circle. Without one the circle is empty. */
  icon?: ReactNode
}

/** The horizontal span in which an element can be seen: the screen, narrowed by the nearest ancestor that clips sideways. */
function visibleBounds(element: HTMLElement) {
  let left = 0
  let right = window.innerWidth
  for (
    let ancestor = element.parentElement;
    ancestor && ancestor !== document.body;
    ancestor = ancestor.parentElement
  ) {
    if (getComputedStyle(ancestor).overflowX === "visible") continue
    const rect = ancestor.getBoundingClientRect()
    left = Math.max(left, rect.left)
    right = Math.min(right, rect.right)
  }
  return { left, right }
}

// Time to cross the gap between the button and its popover without it closing
const CLOSE_DELAY_MS = 150

/**
 * A muted circular button with a dashed blueprint outline that opens a popover.
 * Opens on mouse hover, on keyboard focus, and on a tap (a tap toggles).
 * Closes on mouse leave, blur, Escape, or a click or tap outside.
 */
export function TipIcon({
  size,
  label,
  children,
  className,
  style,
  popoverClassName,
  interactive = false,
  icon,
}: TipIconProps) {
  const [open, setOpen] = useState(false)
  const popoverId = useId()
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pointerType = useRef("")

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), [])
  const show = useCallback(() => {
    cancelClose()
    setOpen(true)
  }, [cancelClose])
  const hideSoon = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }, [cancelClose])

  useEffect(() => cancelClose, [cancelClose])

  // A popover that would run off the edge of the area it can be seen in (the
  // screen, or an ancestor that clips sideways) narrows to fit, so its text
  // wraps instead of being cut off.
  useLayoutEffect(() => {
    const popover = popoverRef.current
    if (!open || !popover) return
    popover.style.maxWidth = ""

    const bounds = visibleBounds(popover)
    const margin = 8
    const { left, right, width } = popover.getBoundingClientRect()
    if (left < bounds.left + margin) {
      popover.style.maxWidth = `${Math.max(0, right - bounds.left - margin)}px`
    } else if (right > bounds.right - margin) {
      popover.style.maxWidth = `${Math.max(
        0,
        Math.min(width, bounds.right - margin - left),
      )}px`
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  return (
    <span
      ref={wrapperRef}
      className={cn("inline-block", className, open && "z-30")}
      style={style}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") show()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hideSoon()
      }}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false)
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType
        }}
        onFocus={(event) => {
          // Keyboard focus opens it. A tap or click focuses too, but those
          // are handled by hover and by the click toggle below.
          if (event.currentTarget.matches(":focus-visible")) show()
        }}
        onClick={() => {
          // A mouse click leaves it open (hover already opened it)
          if (pointerType.current === "mouse") return
          // Keyboard users have it open from focus, so Enter just keeps it open
          if (pointerType.current === "") return show()
          setOpen((value) => !value)
        }}
        className={cn(
          "group border-moonlight/50 text-moonlight hover:border-moonlight focus-visible:border-moonlight focus-visible:ring-moonlight/70 grid shrink-0 cursor-pointer place-items-center rounded-full border border-dashed bg-transparent transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
          sizeClasses[size],
        )}
      >
        {icon}
      </button>
      {open && (
        <span
          ref={popoverRef}
          id={popoverId}
          role={interactive ? "group" : "tooltip"}
          aria-label={interactive ? label : undefined}
          data-popover-container
          className={cn(
            "border-line bg-field text-moonlight-bright absolute z-30 block rounded-md border px-5 py-4 text-sm",
            "top-full left-1/2 mt-2 w-max max-w-xs -translate-x-1/2",
            popoverClassName,
          )}
        >
          {children}
        </span>
      )}
    </span>
  )
}
