"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"

type BreadcrumbItem = {
  label: string
  href: string
}

type BreadcrumbProps = {
  className?: string
}

// Function to generate breadcrumb items from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Add home
  breadcrumbs.push({ label: "Home", href: "/" })

  // Build breadcrumbs from segments
  let currentPath = ""
  segments.forEach((segment) => {
    currentPath += `/${segment}`

    // Convert segment to readable label
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    breadcrumbs.push({ label, href: currentPath })
  })

  return breadcrumbs
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname()

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null

  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-base text-slate-400", className)}
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

// Individual components for more granular control (shadcn style)
export const BreadcrumbList = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <ol className={cn("flex items-center space-x-1", className)}>{children}</ol>
)

export const BreadcrumbItem = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <li className={cn("flex items-center", className)}>{children}</li>

export const BreadcrumbLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center text-slate-400 transition-colors hover:text-slate-200",
      "focus:ring-auth-accent rounded-sm px-1 py-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:outline-none",
      className,
    )}
  >
    {children}
  </Link>
)

export const BreadcrumbPage = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <span
    className={cn("text-auth-accent font-medium", className)}
    aria-current="page"
  >
    {children}
  </span>
)

export const BreadcrumbSeparator = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => (
  <span className={cn("mx-2 text-slate-500", className)}>
    {children ?? <ChevronRight className="h-4 w-4" />}
  </span>
)
