import { useCallback, useEffect, useRef, useState } from "react"

const DRAG_THRESHOLD_PX = 4

type UseDragPanOptions = {
  /** Pan only applies while zoomed in. */
  enabled: boolean
  /** Current zoom scale (e.g. 2.4). */
  scale: number
  /** transform-origin of the zoom, in percent of the element. */
  origin: { x: number; y: number }
}

/**
 * Click-and-drag panning for a zoomed image.
 *
 * Apply `transform: translate(offset) scale(scale)` with the same
 * transform-origin used for the zoom. The offset is clamped so the scaled
 * image never leaves the element's original box. Attach `handlers` to the
 * element that receives clicks, and call `consumeDrag()` at the top of the
 * click handler to ignore the click that ends a drag.
 */
export function useDragPan({ enabled, scale, origin }: UseDragPanOptions) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const gesture = useRef<{
    startX: number
    startY: number
    startOffset: { x: number; y: number }
    width: number
    height: number
    moved: boolean
  } | null>(null)
  const justDragged = useRef(false)

  // Return to the centred position whenever the zoom is released or moved.
  useEffect(() => {
    setOffset({ x: 0, y: 0 })
  }, [enabled, origin.x, origin.y])

  const clamp = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const grow = scale - 1
      const ox = (origin.x / 100) * width
      const oy = (origin.y / 100) * height
      return {
        x: Math.min(ox * grow, Math.max(-(width - ox) * grow, x)),
        y: Math.min(oy * grow, Math.max(-(height - oy) * grow, y)),
      }
    },
    [scale, origin.x, origin.y],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled || (e.pointerType === "mouse" && e.button !== 0)) return
      const el = e.currentTarget
      el.setPointerCapture(e.pointerId)
      justDragged.current = false
      gesture.current = {
        startX: e.clientX,
        startY: e.clientY,
        startOffset: offset,
        width: el.offsetWidth,
        height: el.offsetHeight,
        moved: false,
      }
    },
    [enabled, offset],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const g = gesture.current
      if (!g) return
      const dx = e.clientX - g.startX
      const dy = e.clientY - g.startY
      if (!g.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
      if (!g.moved) {
        g.moved = true
        setIsDragging(true)
      }
      setOffset(
        clamp(g.startOffset.x + dx, g.startOffset.y + dy, g.width, g.height),
      )
    },
    [clamp],
  )

  const endGesture = useCallback(() => {
    if (gesture.current?.moved) justDragged.current = true
    gesture.current = null
    setIsDragging(false)
  }, [])

  /** True once (and only once) if the click that just fired ended a drag. */
  const consumeDrag = useCallback(() => {
    const was = justDragged.current
    justDragged.current = false
    return was
  }, [])

  return {
    offset,
    isDragging,
    consumeDrag,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endGesture,
      onPointerCancel: endGesture,
    },
  }
}
