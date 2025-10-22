import Link from "next/link"

// Component to show a link to the Caracalla and Geta blog post
export function EmbeddedCaracallaGettaBlog() {
  return (
    <div className="mt-16 border-t border-slate-700 pt-12">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold text-slate-200">
          Related Article
        </h2>
        <p className="mb-6 text-slate-400">
          Learn more about the historical context of this coin
        </p>

        <Link
          href="/articles/caracalla-and-geta"
          className="inline-block rounded-lg bg-slate-800 px-8 py-4 text-slate-200 transition-colors duration-200 hover:bg-slate-700"
        >
          <div className="mb-1 text-lg font-medium">
            Caracalla and Geta: Brothers in Power, Rivals in Death
          </div>
          <div className="text-sm text-slate-400">
            Exploring the tumultuous relationship between the Roman co-emperors
          </div>
        </Link>
      </div>
    </div>
  )
}
