import { PageTitle } from "~/components/ui/PageTitle"

export default function YearInCoinsPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Year in Coins</PageTitle>

      <div className="mt-12 text-center">
        <p className="coin-description mb-6">
          Explore coin articles organized by year.
        </p>
        <p className="coin-description">
          Use the navigation menu to select a specific year.
        </p>
      </div>
    </main>
  )
}
