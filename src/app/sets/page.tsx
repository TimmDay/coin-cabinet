import { PageTitle } from "~/components/ui/PageTitle";

export default function SetsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <PageTitle className="mb-6">Coin Sets</PageTitle>
          <p className="coin-description text-xl">
            Curated collections organized by theme and historical period
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-4 text-xl">Severan Dynasty</h3>
            <p className="coin-description mb-4 text-sm">
              Coins from the Severan period (193-235 AD), featuring Septimius
              Severus, Caracalla, Geta, and other members of this influential
              Roman dynasty.
            </p>
            <button className="somnus-button px-4 py-2 text-sm">
              Coming Soon
            </button>
          </div>

          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-4 text-xl">Constantinian</h3>
            <p className="coin-description mb-4 text-sm">
              Coins from Constantine the Great and his successors (306-363 AD),
              marking the transition to the Christian Roman Empire.
            </p>
            <button className="somnus-button px-4 py-2 text-sm">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
