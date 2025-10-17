import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function ImperialWomenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Imperial Women</PageTitle>

        <CoinGrid filterSet="imperial women" />

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Explore coins featuring Imperial Women of the Roman Empire.
          </p>
        </div>
      </div>
    </main>
  )
}
