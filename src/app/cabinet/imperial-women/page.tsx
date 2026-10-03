import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"
import { Quote } from "~/components/ui/Quote"

export default function ImperialWomenPage() {
  return (
    <div className="content-wrapper min-h-[calc(100dvh-9.5rem)]">
      <PageTitle>Imperial Women</PageTitle>

      <CoinGrid filterSet="Imperial Women" />

      <div className="mt-12 md:mt-auto">
        <Quote
          quote="The women leaped from their chariots and, rushing into the midst of the fleeing men, by their tears and entreaties stayed their flight... restoring the battle."
          attribution="Herodian, History of the Roman Empire 5.8.8"
        />
      </div>
    </div>
  )
}
