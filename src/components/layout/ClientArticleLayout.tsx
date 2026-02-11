/**
 * ClientArticleLayout - Client-side layout wrapper for article pages
 *
 * PURPOSE:
 * This component handles the client-side rendering of article layouts, providing
 * dynamic page titles and conditional UI elements based on the current route.
 *
 * WHERE IT'S USED:
 * - Imported by src/app/articles/layout.tsx (server component)
 * - Wraps all content under the /articles route
 * - Applied to individual article pages, article index, and year-in-coins pages
 *
 * WHY IT'S NECESSARY:
 * 1. Server/Client Boundary: Separates server-side metadata processing from client-side
 *    pathname detection (usePathname hook requires client component)
 * 2. Dynamic Titles: Shows article-specific titles from metadata instead of generic "Articles"
 * 3. Conditional Layout: Manages Table of Contents visibility based on article type
 * 4. Responsive Design: Handles prose styling and sidebar positioning for different screen sizes
 *
 * ARCHITECTURE:
 * Server Component (layout.tsx) → processes metadata → passes to Client Component → renders UI
 */

"use client"

import { usePathname } from "next/navigation"
import { TableOfContents } from "~/components/blog/TableOfContents"
import { PageTitle } from "~/components/ui/PageTitle"
import type { ArticleMetadata } from "~/lib/utils/article-metadata"

type ClientArticleLayoutProps = {
  children: React.ReactNode
  articleMetadata: Record<string, ArticleMetadata>
}

// Helper function to get article title and subtitle based on pathname
function getArticleDisplayData(
  pathname: string,
  articleMetadata: Record<string, ArticleMetadata>,
): { title: string; subtitle: string } {
  // Check if we have metadata for this specific article
  const metadata = articleMetadata[pathname]
  if (metadata) {
    return {
      title: metadata.title,
      subtitle:
        metadata.subtitle ??
        metadata.description ??
        "Historical insights and numismatic research",
    }
  }

  // Default title and subtitle for articles index page
  if (pathname === "/articles") {
    return {
      title: "Articles",
      subtitle: "Historical insights and numismatic research",
    }
  }

  // For year-in-coins articles, extract year from path
  if (pathname.includes("/year-in-coins/")) {
    const year = pathname.split("/").pop()
    return {
      title: year ? `${year} in Coins` : "Year in Coins",
      subtitle: "",
    }
  }

  // Fallback
  return {
    title: "Articles",
    subtitle: "Historical insights and numismatic research",
  }
}

export function ClientArticleLayout({
  children,
  articleMetadata,
}: ClientArticleLayoutProps) {
  const pathname = usePathname()

  // Only show Table of Contents for markdown articles, not for year-in-coins
  const showTableOfContents = !pathname.includes("/year-in-coins")

  // Get dynamic title and subtitle based on the current route
  const { title, subtitle } = getArticleDisplayData(pathname, articleMetadata)

  return (
    <main className="bg-background min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <PageTitle subtitle={subtitle}>{title}</PageTitle>
        </div>

        <div
          className={`flex gap-8 ${showTableOfContents ? "" : "justify-center"}`}
        >
          {/* Main content */}
          <article
            className={`prose prose-slate prose-invert max-w-none ${showTableOfContents ? "flex-1" : "max-w-4xl"}`}
          >
            {children}
          </article>

          {/* Table of Contents sidebar - only for markdown articles */}
          {showTableOfContents && (
            <aside className="hidden w-80 flex-shrink-0 lg:block">
              <TableOfContents />
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}
