import { PageTitle } from "~/components/ui/PageTitle"

export default function AboutPage() {
  return (
    <div className="content-wrapper">
      <PageTitle>About</PageTitle>

      <div className="artemis-card mx-auto max-w-4xl p-8">
        <div className="space-y-6 text-slate-300">
          <p className="text-lg leading-relaxed">
            Welcome to the Coin Cabinet, a digital collection showcasing ancient
            coins from various civilizations and periods throughout history.
          </p>

          <p className="leading-relaxed">
            This collection features coins from the Roman Empire, including
            pieces from the Republican period through the Imperial era, with
            special focus on significant dynasties like the Severan and
            Constantinian periods.
          </p>

          <p className="leading-relaxed">
            Each coin in the collection includes detailed information about its
            historical context, minting details, and significance. The
            collection is organized both chronologically and thematically to
            provide multiple ways to explore these fascinating artifacts.
          </p>

          <div className="mt-8 border-t border-slate-600 pt-6">
            <h2 className="coin-title mb-4 text-xl">Collection Features</h2>
            <ul className="space-y-2 text-slate-300">
              <li>
                • High-resolution images of both obverse and reverse sides
              </li>
              <li>• Detailed historical and numismatic information</li>
              <li>• Organized by civilization, period, and thematic sets</li>
              <li>• Interactive viewing with zoom and comparison features</li>
              <li>• Educational articles and historical context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
