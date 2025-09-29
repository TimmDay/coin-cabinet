import { CoinGrid } from "~/components/ui/CoinGrid";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-200 sm:text-6xl lg:text-7xl">
            The Coin <span className="heading-accent">Cabinet</span>
          </h1>
          <p className="coin-description mx-auto max-w-2xl text-xl">
            A curated collection of ancient coins, combining the art of
            numismatics with modern photography and digital presentation.
          </p>
        </div>

        <CoinGrid />

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Discover the fascinating world of ancient numismatics through our
            carefully documented collection.
          </p>
          <button className="somnus-button px-8 py-3 text-lg font-medium">
            Explore the Collection
          </button>
        </div>
      </div>
    </main>
  );
}
