import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function DetectorFindsPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Detector Finds</PageTitle>

      <CoinGrid filterSet="detector" showProvenance />
    </main>
  )
}
