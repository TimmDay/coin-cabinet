import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function CabinetPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>The Coin Cabinet</PageTitle>

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
  )
}
