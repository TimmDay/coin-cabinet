import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function RomanTimelinePage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Roman</PageTitle>
      <CoinGrid filterSet="roman-timeline" />
    </main>
  )
}
