import { PageTitle } from "~/components/ui/PageTitle"

export default function YearInCoins2025Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Year in Coins - 2025</PageTitle>

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Articles and insights about coins from 2025.
          </p>
          <p className="coin-description">
            Content for 2025 coin articles will be displayed here.
          </p>
        </div>
      </div>
    </main>
  )
}
