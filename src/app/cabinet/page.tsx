import { PageTitle } from "~/components/ui/PageTitle"
import { SetPreviewCard } from "~/components/ui/SetPreviewCard"
import { featuredSets } from "~/lib/constants/sets"

export default function CabinetPage() {
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
              image={set.image}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
