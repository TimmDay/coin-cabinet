import Link from "next/link"

// Component to show a link to the Caracalla and Geta blog post
export function EmbeddedBlogLinkCaracallaGeta() {
  return (
    <div className="border-line mt-16 border-t pt-12">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">Related Article</h2>
        <p className="text-moonlight mb-6">
          Learn more about the historical context of this coin
        </p>

        <Link
          href="/articles/caracalla-and-geta"
          className="bg-field text-moonlight-bright hover:bg-surface-raised inline-block rounded-lg px-8 py-4 transition-colors duration-200"
        >
          <div className="mb-1 text-lg font-medium">
            Caracalla and Geta: Brothers in Power, Rivals in Death
          </div>
          <div className="text-moonlight text-sm">
            Exploring the tumultuous relationship between the Roman co-emperors
          </div>
        </Link>
      </div>
    </div>
  )
}
