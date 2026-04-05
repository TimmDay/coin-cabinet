import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function ByzantinePage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Byzantine</PageTitle>
      <CoinGrid filterCiv="Byzantine" />
    </main>
  )
}
