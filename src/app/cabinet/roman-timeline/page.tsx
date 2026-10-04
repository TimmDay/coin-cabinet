import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function RomanTimelinePage() {
  return (
    <div className="content-wrapper">
      <PageTitle>Roman</PageTitle>
      <CoinGrid filterSet="Roman Timeline" />
    </div>
  )
}
