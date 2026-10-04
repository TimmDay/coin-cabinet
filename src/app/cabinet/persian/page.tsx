import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function PersianPage() {
  return (
    <div className="content-wrapper">
      <PageTitle>Persian</PageTitle>
      <CoinGrid filterSet="Persian" />
    </div>
  )
}
