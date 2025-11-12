import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function JudeaPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Judea</PageTitle>
      <CoinGrid filterCiv="Judea" />
    </main>
  )
}
