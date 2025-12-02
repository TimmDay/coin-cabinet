import Link from "next/link"
import { PageTitle } from "~/components/ui/PageTitle"
import { SetPreviewCard } from "~/components/ui/SetPreviewCard"
import { romanSets } from "~/data/sets"

export default function RomanCabinetPage() {
  return (
    <main className="content-wrapper">
      <PageTitle>Roman Sets</PageTitle>

      {/* Roman Sets Grid */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {romanSets.map((set) => (
          <SetPreviewCard
            key={set.name}
            name={set.name}
            href={set.href}
            description={set.description}
            image={set.image}
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
    </main>
  )
}
