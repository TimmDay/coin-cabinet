import { useEffect, useRef } from "react"

const DESKTOP_MIN_WIDTH = 1024

/**
 * Sizes an element so the next thing on the page peeks in at the bottom of the
 * first screen, however tall the window is: the element's minimum height is
 * the window height, less what sits above it, less the gap to the next element,
 * less `peek` pixels. Desktop only (from 1024px wide). An element taller than
 * that keeps its own height, so content is never squashed.
 */
export function useFoldFill<T extends HTMLElement>(peek: number) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      if (window.innerWidth < DESKTOP_MIN_WIDTH) {
        element.style.minHeight = ""
        return
      }
      const rect = element.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const next = element.nextElementSibling
      const gap = next ? next.getBoundingClientRect().top - rect.bottom : 0
      const height = window.innerHeight - top - gap - peek
      element.style.minHeight = `${Math.max(0, Math.round(height))}px`
    }

    update()
    // The page above (title, fonts) and the window can change size
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [peek])

  return ref
}
