import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function AdoptiveEmperorsPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>The Adoptive Emperors</PageTitle>
      <CoinGrid filterSet="adoptive-emperors" />
    </main>
  )
}
