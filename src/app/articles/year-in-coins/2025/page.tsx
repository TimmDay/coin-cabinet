import { PageTitle } from "~/components/ui/PageTitle"
import { YearCoinGrid } from "~/components/ui/YearCoinGrid"

export default function YearInCoins2025Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PageTitle>Year in Coins - 2025</PageTitle>

      <div className="mt-8">
        <YearCoinGrid year="2025" />
      </div>
    </main>
  )
}
