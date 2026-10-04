import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function DetectorFindsPage() {
  return (
    <div className="content-wrapper">
      <PageTitle>Detector Finds</PageTitle>

      <CoinGrid filterSet="Detector" />
    </div>
  )
}
