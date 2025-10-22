"use client"

import { usePathname } from "next/navigation"
import { PageTitle } from "~/components/ui/PageTitle"
import { TableOfContents } from "~/components/ui/TableOfContents"

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Only show Table of Contents for markdown articles, not for year-in-coins
  const showTableOfContents = !pathname.includes("/year-in-coins")

  return (
    <main className="bg-background min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <PageTitle subtitle="Historical insights and numismatic research">
            Articles
          </PageTitle>
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
