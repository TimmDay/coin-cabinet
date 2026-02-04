"use client"

import { useEffect, useState } from "react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    // Throttle scroll events to improve performance and reduce interference
    const throttledToggleVisibility = () => {
      if (timeoutId) return

      timeoutId = setTimeout(() => {
        toggleVisibility()
        timeoutId = null
      }, 100) // Throttle to 10fps max
    }

    // Use passive listener to tell browser we won't preventDefault()
    window.addEventListener("scroll", throttledToggleVisibility, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", throttledToggleVisibility)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/40 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-slate-600/40 focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:outline-none"
          aria-label="Scroll to top"
        >
          <svg
            className="h-6 w-6 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </>
  )
}
