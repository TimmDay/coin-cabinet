import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function HoardsPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Hoards</PageTitle>

      <CoinGrid filterSet="hoards" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coins discovered in ancient hoards.
        </p>
      </div>
    </main>
  )
}
