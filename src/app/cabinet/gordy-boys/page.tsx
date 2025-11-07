import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function GordyBoysPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Gordy Boys</PageTitle>

      <CoinGrid filterSet="gordy boys" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coins from the Gordian dynasty period.
        </p>
      </div>
    </main>
  )
}
