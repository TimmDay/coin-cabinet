import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"

export default function ImperialWomenPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Imperial Women</PageTitle>

      <CoinGrid filterSet="Imperial Women" />

      <div className="mt-12 text-center">
        <p className="text-ink-muted mb-6 leading-[1.7]">
          Explore coins featuring Imperial Women of the Roman Empire.
        </p>
      </div>
    </main>
  )
}
