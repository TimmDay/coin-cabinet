import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function CrisisPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Crisis</PageTitle>

      <CoinGrid filterSet="crisis" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coins from the Crisis of the Third Century period.
        </p>
      </div>
    </main>
  )
}
