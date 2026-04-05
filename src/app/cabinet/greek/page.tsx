import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function GreekPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Greek</PageTitle>
      <CoinGrid filterCiv="Ancient Greece" />
    </main>
  )
}
