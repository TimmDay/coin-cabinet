import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function CabinetGreekPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Cabinet - Greek Coins</PageTitle>

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Browse all Ancient Greek coins from the cabinet collection.
        </p>
      </div>

      <CoinGrid filterCiv="Ancient Greece" />
    </main>
  )
}
