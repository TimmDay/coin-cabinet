import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function CrisisPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Crisis</PageTitle>

      <CoinGrid filterSet="crisis" />

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          From 235 to 284 AD (49 years) there were 26 official emperors. A new
          one every 1.9 years. Counting usurpers brings the number of guys
          claiming power to 50-60. 85% of these guys died violently, most by
          murder, some in battle. There was also plague, invasions, inflationary
          economic turmoil and breakaway states.
        </p>
      </div>
    </main>
  )
}
