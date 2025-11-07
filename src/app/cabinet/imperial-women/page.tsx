import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function ImperialWomenPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Imperial Women</PageTitle>

      <CoinGrid filterSet="imperial women" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coins featuring Imperial Women of the Roman Empire.
        </p>
      </div>
    </main>
  )
}
