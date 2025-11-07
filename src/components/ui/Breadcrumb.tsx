"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"

type BreadcrumbItem = {
  label: string
  href: string
}

type BreadcrumbProps = {
  className?: string
  items?: BreadcrumbItem[]
}

// Function to generate breadcrumb items from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Add home
  breadcrumbs.push({ label: "Home", href: "/" })

  // Don't add breadcrumbs for home page
  if (pathname === "/") {
    return breadcrumbs
  }

  // Build breadcrumbs from segments
  let currentPath = ""
  segments.forEach((segment) => {
    currentPath += `/${segment}`

    // Check if this segment is a coin slug (format: "123-coin-name")
    const coinSlugPattern = /^\d+-/
    if (coinSlugPattern.exec(segment)) {
      // This is a coin slug, extract the nickname part
      const nickname = segment.replace(/^\d+-/, "")
      const cleanLabel = nickname
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      breadcrumbs.push({ label: cleanLabel, href: currentPath })
    } else {
      // Convert segment to readable label
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      breadcrumbs.push({ label, href: currentPath })
    }
  })

  return breadcrumbs
}

export function Breadcrumb({ className, items }: BreadcrumbProps) {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null

  // Use provided items or generate from URL
  const breadcrumbs = items ?? generateBreadcrumbs(pathname)

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-base text-slate-400", className)}
      data-breadcrumb
    >
      <div className="flex items-center">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <span key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-1 text-slate-500">/</span>}

              {isLast ? (
                <span className="text-slate-300" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-400 transition-colors hover:[color:hsl(var(--primary))]"
                >
                  {item.label}
                </Link>
              )}
            </span>
          )
        })}
      </div>
    </nav>
  )
}
