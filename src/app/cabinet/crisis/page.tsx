import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function CrisisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Crisis</PageTitle>

        <CoinGrid filterSet="crisis" />

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Explore coins from the Crisis of the Third Century period.
          </p>
        </div>
      </div>
    </main>
  )
}
