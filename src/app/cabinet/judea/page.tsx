import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function JudeaPage() {
  return (
    <div className="content-wrapper">
      <PageTitle>Judea</PageTitle>
      <CoinGrid filterCiv="Judea" />
    </div>
  )
}
