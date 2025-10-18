import { PageTitle } from "~/components/ui/PageTitle"
import { SetPreviewCard } from "~/components/ui/SetPreviewCard"

export default function CabinetPage() {
  const featuredSets = [
    {
      name: "Severan Dynasty",
      href: "/cabinet/severan-dynasty",
      description:
        "Coins from the Severan period (193-235 AD), featuring the imperial family that ruled during a time of military expansion and architectural achievement.",
    },
    {
      name: "Gordy Boys",
      href: "/cabinet/gordy-boys",
      description:
        "A curated collection highlighting the artistic and historical significance of coins from this distinctive period.",
    },
    {
      name: "Imperial Women",
      href: "/cabinet/imperial-women",
      description:
        "Celebrating the powerful women of the Roman Empire through their numismatic representations and imperial portraiture.",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>The Coin Cabinet</PageTitle>

        {/* Featured Sets Grid */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredSets.map((set) => (
            <SetPreviewCard
              key={set.name}
              name={set.name}
              href={set.href}
              description={set.description}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
