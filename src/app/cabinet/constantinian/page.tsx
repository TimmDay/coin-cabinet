import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function ConstantinianPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Constantinian</PageTitle>

        <CoinGrid filterSet="constantinian" />

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Explore coins from the Constantinian period of Roman Imperial
            history.
          </p>
        </div>
      </div>
    </main>
  )
}
