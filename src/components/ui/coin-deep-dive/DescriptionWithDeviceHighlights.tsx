"use client"

import { useEffect, useRef, useState } from "react"
import type { Device } from "~/database/schema-devices"

type Segment =
  | { kind: "text"; text: string }
  | { kind: "match"; text: string; device: Device }

function segmentText(text: string, devices: Device[]): Segment[] {
  if (!text || devices.length === 0) return [{ kind: "text", text }]

  // Longest-name-first so "ballista bolt" beats "bolt"
  const sorted = [...devices].sort((a, b) => b.name.length - a.name.length)

  const matches: { start: number; end: number; device: Device }[] = []

  for (const device of sorted) {
    const escaped = device.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(escaped, "gi")
    let m
    while ((m = regex.exec(text)) !== null) {
      const start = m.index
      const end = m.index + m[0].length
      const overlaps = matches.some((e) => start < e.end && end > e.start)
      if (!overlaps) matches.push({ start, end, device })
    }
  }

  matches.sort((a, b) => a.start - b.start)

  const segments: Segment[] = []
  let cursor = 0
  for (const { start, end, device } of matches) {
    if (start > cursor)
      segments.push({ kind: "text", text: text.slice(cursor, start) })
    segments.push({ kind: "match", text: text.slice(start, end), device })
    cursor = end
  }
  if (cursor < text.length)
    segments.push({ kind: "text", text: text.slice(cursor) })

  return segments
}

type HighlightedWordProps = {
  text: string
  device: Device
  popoverId: string
}

function HighlightedWord({ text, device, popoverId }: HighlightedWordProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLSpanElement>(null)

  // Once open, center the popover within the nearest <p> container
  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const popover = popoverRef.current
    if (!trigger || !popover) return

    const container =
      trigger.closest<HTMLElement>("[data-popover-container]") ??
      trigger.parentElement
    if (!container) return

    const triggerRect = trigger.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // How far the popover's left edge must shift (relative to trigger's left edge)
    // so that the popover is horizontally centred inside the container
    const containerCenter = containerRect.left + containerRect.width / 2
    const popoverWidth = containerRect.width
    popover.style.width = `${popoverWidth}px`
    const idealLeft = containerCenter - popoverWidth / 2
    const offsetFromTrigger = idealLeft - triggerRect.left

    // Clamp so the popover never escapes the container edges
    const clampedOffset = Math.max(
      containerRect.left - triggerRect.left,
      Math.min(
        offsetFromTrigger,
        containerRect.right - triggerRect.left - popoverWidth,
      ),
    )

    popover.style.transform = `translateX(${clampedOffset}px) translateY(calc(-100% - 4px))`
  }, [open])

  return (
    <span ref={triggerRef} className="relative inline">
      <span
        className="bg-bronze/20 text-bronze-light hover:bg-bronze/30 hover:text-ink cursor-pointer rounded px-0.5 underline decoration-dotted underline-offset-2 transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={(e) => {
          const related = e.relatedTarget as Node | null
          if (document.getElementById(popoverId)?.contains(related)) return
          setOpen(false)
        }}
        onClick={() => setOpen((v) => !v)}
        aria-describedby={open ? popoverId : undefined}
      >
        {text}
      </span>

      {open && (
        <span
          ref={popoverRef}
          id={popoverId}
          role="tooltip"
          className="border-line bg-field text-moonlight absolute top-0 left-0 z-50 rounded-lg border p-3 text-left text-sm shadow-xl backdrop-blur-sm"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <p className="text-bronze-light mb-1 font-semibold">{device.name}</p>
          {device.translation && (
            <p className="text-moonlight mb-1 text-sm italic">
              {device.translation}
            </p>
          )}
          <p className="text-moonlight text-sm leading-relaxed">
            {device.description}
          </p>
        </span>
      )}
    </span>
  )
}

type Props = {
  text: string
  devices: Device[]
  className?: string
}

export function DescriptionWithDeviceHighlights({
  text,
  devices,
  className,
}: Props) {
  const segments = segmentText(text, devices)

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.kind === "text" ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <HighlightedWord
            key={i}
            text={seg.text}
            device={seg.device}
            popoverId={`device-popover-${seg.device.id}-${i}`}
          />
        ),
      )}
    </span>
  )
}
