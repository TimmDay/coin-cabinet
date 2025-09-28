import { CoinCard } from "~/components/ui/CoinCard";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-slate-200 sm:text-6xl lg:text-7xl">
            The Coin <span className="heading-accent">Cabinet</span>
          </h1>
          <p className="text-xl coin-description max-w-2xl mx-auto">
            A curated collection of ancient coins, combining the art of numismatics 
            with modern photography and digital presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <CoinCard
            title="Featured Coin"
            description="Explore the details of our latest acquisition"
          />
          <CoinCard
            imageSrc="1_faustina_II_sestertius_o"
            title="Faustina II"
            description="Sestertius, obverse view"
          />
          <CoinCard
            imageSrc="1_faustina_II_sestertius_r"
            title="Faustina II"
            description="Sestertius, reverse view"
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Discover the fascinating world of ancient numismatics through our carefully documented collection.
          </p>
          <button className="artemis-button px-8 py-3 text-lg font-medium">
            Explore the Collection
          </button>
        </div>
      </div>
    </main>
  );
}
