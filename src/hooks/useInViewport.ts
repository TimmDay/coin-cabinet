"use client"

import { useEffect, useState } from "react"

/**
 * Hook to detect when an element enters the viewport using IntersectionObserver.
 * Once the element enters the viewport, it stops observing (one-time trigger).
 *
 * @param ref - React ref to the element to observe
 * @param options - IntersectionObserver options (rootMargin, threshold, etc.)
 * @returns boolean indicating if the element is in viewport
 */
export function useInViewport(
  ref: React.RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit,
) {
  const [isInViewport, setIsInViewport] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInViewport(true)
          // Once in viewport, stop observing
          observer.disconnect()
        }
      },
      {
        rootMargin: "100px", // Default: Load slightly before entering viewport
        ...options,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, options])

  return isInViewport
}
