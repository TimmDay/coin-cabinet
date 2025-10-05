"use client"

import { useEffect, useState } from "react"

export function useViewport() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    // Check on mount
    checkViewport()

    // Listen for resize events
    window.addEventListener("resize", checkViewport)

    return () => {
      window.removeEventListener("resize", checkViewport)
    }
  }, [])

  return { isMobile }
}
