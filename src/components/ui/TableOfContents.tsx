"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type TocItem = {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Generate TOC from headings in the document
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const items: TocItem[] = Array.from(headings).map((heading) => {
      const text = heading.textContent || ""
      let id = heading.id

      // If heading doesn't have an id, create one
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
        heading.id = id
      }

      return {
        id,
        text,
        level: parseInt(heading.tagName.charAt(1)),
      }
    })

    setTocItems(items)

    // Function to find the current active heading based on scroll position
    const updateActiveHeading = () => {
      const scrollTop = window.scrollY
      const headerOffset = 100 // Account for any fixed header

      // Find the heading that's closest to the top of the viewport
      let activeHeading = ""
      let closestDistance = Infinity

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        const headingTop = scrollTop + rect.top
        const distance = Math.abs(headingTop - scrollTop - headerOffset)

        // Only consider headings that are at or above the current scroll position
        if (
          headingTop <= scrollTop + headerOffset + 50 &&
          distance < closestDistance
        ) {
          closestDistance = distance
          activeHeading = heading.id
        }
      })

      // If no heading is above, use the first visible one
      if (!activeHeading) {
        for (const heading of headings) {
          const rect = heading.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= window.innerHeight) {
            activeHeading = heading.id
            break
          }
        }
      }

      if (activeHeading) {
        setActiveId(activeHeading)
      }
    }

    // Set up scroll listener
    window.addEventListener("scroll", updateActiveHeading, { passive: true })

    // Initial call to set active heading
    updateActiveHeading()

    return () => {
      window.removeEventListener("scroll", updateActiveHeading)
    }
  }, [])

  if (tocItems.length === 0) return null

  return (
    <div className="sticky top-8">
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-200">
          Table of Contents
        </h3>
        <nav>
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li
                key={item.id}
                className={`${
                  item.level === 1
                    ? "pl-0"
                    : item.level === 2
                      ? "pl-4"
                      : item.level === 3
                        ? "pl-8"
                        : "pl-12"
                }`}
              >
                <Link
                  href={`#${item.id}`}
                  className={`block text-sm transition-colors duration-200 hover:text-slate-200 ${
                    activeId === item.id
                      ? "font-medium text-slate-200"
                      : "text-slate-400"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
