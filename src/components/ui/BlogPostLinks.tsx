"use client"

import Link from "next/link"

type BlogPostLinksProps = {
  routes: string[]
}

function inferTitleFromRoute(route: string): string {
  // Remove leading slash and preserve the full path
  const cleanPath = route.replace(/^\//, "")

  // Convert kebab-case to Title Case for each segment, then join with " / "
  return cleanPath
    .split("/")
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" / ")
}

function ensureLeadingSlash(route: string): string {
  return route.startsWith("/") ? route : `/${route}`
}

export function BlogPostLinks({ routes }: BlogPostLinksProps) {
  if (!routes || routes.length === 0) {
    return null
  }

  return (
    <div className="mt-12 space-y-4">
      <h3 className="mb-6 text-xl font-semibold text-slate-300">
        Related Articles
      </h3>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route, index) => {
          const normalizedRoute = ensureLeadingSlash(route)
          const title = inferTitleFromRoute(route)

          return (
            <Link
              key={index}
              href={normalizedRoute}
              className="block rounded-lg border border-slate-600 bg-slate-800/50 p-4 transition-all duration-200 hover:border-amber-400 hover:bg-slate-700/50"
            >
              <div className="text-center">
                <div className="mb-1 text-sm font-medium text-amber-400">
                  Learn More
                </div>
                <div className="text-sm text-slate-300">Post: {title}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
