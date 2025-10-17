import { PageTitle } from "~/components/ui/PageTitle"

export default function YearInCoinsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Year in Coins</PageTitle>

        <div className="mt-12 text-center">
          <p className="coin-description mb-6">
            Explore coin articles organized by year.
          </p>
          <p className="coin-description">
            Use the navigation menu to select a specific year.
          </p>
        </div>
      </div>
    </main>
  )
}
