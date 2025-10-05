import { PageTitle } from "~/components/ui/PageTitle"

export default function SetsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <PageTitle className="mb-6">Themed Sets</PageTitle>
          <p className="coin-description text-xl">
            Curated collections organized by period, theme, or provenance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Severan Dynasty</h3>
            <p className="coin-description text-sm">
              Imperial family portraits from 193-235 AD
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Imperial Women</h3>
            <p className="coin-description text-sm">
              Empresses and daughters of Rome
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">From Hoards</h3>
            <p className="coin-description text-sm">
              Archaeological discoveries and treasure finds
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
