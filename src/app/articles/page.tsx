import { PageTitle } from "~/components/ui/PageTitle"

export default function ArticlesPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <PageTitle className="mb-6">Articles</PageTitle>
          <p className="text-ink-soft text-xl leading-[1.7]">
            Coming soon - insights and stories from the world of numismatics
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="artemis-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Articles & Research
            </h2>
            <p className="text-ink-soft mb-6 text-lg leading-[1.7]">
              This section will feature in-depth articles about ancient coins,
              historical context, and numismatic research.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="artemis-card p-6">
                <h3 className="mb-2 text-lg font-semibold tracking-tight">
                  Historical Context
                </h3>
                <p className="text-ink-soft text-sm leading-[1.7]">
                  Explore the historical significance of ancient coins
                </p>
              </div>
              <div className="artemis-card p-6">
                <h3 className="mb-2 text-lg font-semibold tracking-tight">
                  Numismatic Research
                </h3>
                <p className="text-ink-soft text-sm leading-[1.7]">
                  Latest findings and research in the field
                </p>
              </div>
              <div className="artemis-card p-6">
                <h3 className="mb-2 text-lg font-semibold tracking-tight">
                  Collection Stories
                </h3>
                <p className="text-ink-soft text-sm leading-[1.7]">
                  Stories behind notable coins and collections
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
