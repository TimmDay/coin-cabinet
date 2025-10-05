import { PageTitle } from "~/components/ui/PageTitle";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <PageTitle className="mb-6">Articles</PageTitle>
          <p className="coin-description text-xl">
            Coming soon - insights and stories from the world of numismatics
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="artemis-card p-8 text-center">
            <h2 className="coin-title mb-4 text-2xl font-semibold">
              Articles & Research
            </h2>
            <p className="coin-description mb-6 text-lg">
              This section will feature in-depth articles about ancient coins,
              historical context, and numismatic research.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="artemis-card p-6">
                <h3 className="coin-title mb-2 text-lg font-medium">
                  Historical Context
                </h3>
                <p className="coin-description text-sm">
                  Explore the historical significance of ancient coins
                </p>
              </div>
              <div className="artemis-card p-6">
                <h3 className="coin-title mb-2 text-lg font-medium">
                  Numismatic Research
                </h3>
                <p className="coin-description text-sm">
                  Latest findings and research in the field
                </p>
              </div>
              <div className="artemis-card p-6">
                <h3 className="coin-title mb-2 text-lg font-medium">
                  Collection Stories
                </h3>
                <p className="coin-description text-sm">
                  Stories behind notable coins and collections
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
