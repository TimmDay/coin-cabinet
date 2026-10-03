import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"
import { Quote } from "~/components/ui/Quote"

export default function GordyBoysPage() {
  return (
    <div className="content-wrapper min-h-[calc(100dvh-9.5rem)]">
      <PageTitle>Gordy Boys</PageTitle>

      <CoinGrid filterSet="Gordy Boys" />

      <div className="mt-12 md:mt-auto">
        <Quote
          quote="He was very elegant in his dress, and beloved by his slaves and entire household."
          attribution="Historia Augusta 20, The Three Gordians"
        />
      </div>
    </div>
  )
}
