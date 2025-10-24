import { CoinGrid } from "~/components/ui/CoinGrid"
import { PageTitle } from "~/components/ui/PageTitle"
import { Quote } from "~/components/ui/Quote"

export default function SeveranDynastyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Severan Dynasty</PageTitle>

        <CoinGrid filterSet="severan" />

        <div className="mt-12">
          <Quote
            quote="Be harmonious with each other, enrich the soldiers, and scorn all other men."
            attribution="Cassius Dio, Roman History Book 77, Part 15"
            link="https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cassius_Dio/77*.html#15"
          />
        </div>
      </div>
    </main>
  )
}
