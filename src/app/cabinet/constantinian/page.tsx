import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function ConstantinianPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Constantinian</PageTitle>

      <CoinGrid filterSet="constantinian" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coins from the Constantinian period of Roman Imperial history.
        </p>
      </div>
    </main>
  )
}
