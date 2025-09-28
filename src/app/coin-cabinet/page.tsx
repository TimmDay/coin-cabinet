export default function CoinCabinetPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-200 sm:text-6xl">
            Coin <span className="heading-accent">Cabinet</span>
          </h1>
          <p className="coin-description mt-4 text-xl">
            The collection awaits...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Roman Imperial</h3>
            <p className="coin-description text-sm">
              Emperors and their legacies in bronze, silver, and gold
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Roman Republic</h3>
            <p className="coin-description text-sm">
              The foundations of numismatic artistry
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Greek & Hellenistic</h3>
            <p className="coin-description text-sm">
              Classical beauty in ancient coinage
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Byzantine</h3>
            <p className="coin-description text-sm">
              Medieval continuity of Roman tradition
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Themed Collections</h3>
            <p className="coin-description text-sm">
              Curated sets from specific periods and regions
            </p>
          </div>
          <div className="artemis-card p-6 text-center">
            <h3 className="coin-title mb-2 text-lg">Recent Acquisitions</h3>
            <p className="coin-description text-sm">
              Latest additions to the collection
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
