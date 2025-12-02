import Link from "next/link"
import { PageTitle } from "~/components/ui/PageTitle"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <PageTitle className="mb-6">Page Not Found</PageTitle>
          <p className="coin-description mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <Link
            href="/"
            className="inline-block rounded-md bg-amber-600 px-6 py-3 text-white transition-colors hover:bg-amber-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}
