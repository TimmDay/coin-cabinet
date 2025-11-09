import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function GordyBoysPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Gordy Boys</PageTitle>

      <CoinGrid filterSet="gordy boys" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          {`"He was very elegant in his dress, and beloved by his slaves and entire household." - Historia Augusta 20. The Three Gordians `}
        </p>
      </div>
    </main>
  )
}
