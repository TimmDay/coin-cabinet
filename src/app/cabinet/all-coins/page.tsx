import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function AllCoinsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PageTitle>All Coins</PageTitle>

      <div className="mt-8">
        <CoinGrid showSearch={true} />
      </div>
    </main>
  )
}
