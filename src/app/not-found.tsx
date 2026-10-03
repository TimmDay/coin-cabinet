import Link from "next/link"
import { PageTitle } from "~/components/ui/PageTitle"

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <PageTitle className="mb-6">Page Not Found</PageTitle>
          <p className="text-ink-muted mb-8 leading-[1.7]">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <Link
            href="/"
            className="bg-bronze text-night hover:bg-bronze-light inline-block rounded-md px-6 py-3 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}
