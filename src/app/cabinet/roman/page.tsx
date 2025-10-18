import Link from "next/link"
import { PageTitle } from "~/components/ui/PageTitle"
import { SetPreviewCard } from "~/components/ui/SetPreviewCard"

export default function RomanCabinetPage() {
  const romanSets = [
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
      name: "Crisis",
      href: "/cabinet/crisis",
      description:
        "Numismatic evidence from the Crisis of the Third Century, reflecting the political and economic turmoil of the Roman Empire.",
    },
    {
      name: "Imperial Women",
      href: "/cabinet/imperial-women",
      description:
        "Celebrating the powerful women of the Roman Empire through their numismatic representations and imperial portraiture.",
    },
    {
      name: "Tetrachy",
      href: "/cabinet/tetrachy",
      description:
        "Coins from Diocletian's revolutionary four-ruler system that stabilized the empire and reformed its administration.",
    },
    {
      name: "Constantinian",
      href: "/cabinet/constantinian",
      description:
        "The transformative period of Constantine the Great, including the first Christian symbols on Roman coinage.",
    },
    {
      name: "Hoards",
      href: "/cabinet/hoards",
      description:
        "Archaeological treasure finds that provide insight into ancient economic conditions and coin circulation patterns.",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <PageTitle>Roman Sets</PageTitle>

        {/* Roman Sets Grid */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {romanSets.map((set) => (
            <SetPreviewCard
              key={set.name}
              name={set.name}
              href={set.href}
              description={set.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/cabinet"
            className="somnus-button inline-block px-8 py-3 text-lg font-medium"
          >
            ← Back to Cabinet
          </Link>
        </div>
      </div>
    </main>
  )
}
