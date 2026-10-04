import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function SilverEmperorsPage() {
  return (
    <div className="content-wrapper">
      <PageTitle>Roman Emperors</PageTitle>
      <CoinGrid filterSet="Silver Emperors" />
    </div>
  )
}
