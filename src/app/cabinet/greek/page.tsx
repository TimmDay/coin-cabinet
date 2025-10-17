import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function CabinetGreekPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Cabinet - Greek Coins</PageTitle>

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Browse all Ancient Greek coins from the cabinet collection.
          </p>
        </div>

        <CoinGrid filterCiv="Ancient Greece" />
      </div>
    </main>
  )
}
