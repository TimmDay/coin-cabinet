import Link from "next/link"
import { PageTitle } from "~/components/ui/PageTitle"
import { SetPreviewCard } from "~/components/ui/SetPreviewCard"
import { romanSets } from "~/lib/constants/sets"

export default function RomanCabinetPage() {
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
      </div>
    </main>
  )
}
