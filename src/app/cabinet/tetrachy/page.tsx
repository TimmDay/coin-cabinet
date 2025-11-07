import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function TetrachyPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Tetrachy</PageTitle>

      <CoinGrid filterSet="tetrachy" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coins from the Tetrarchy period of Roman Imperial history.
        </p>
      </div>
    </main>
  )
}
