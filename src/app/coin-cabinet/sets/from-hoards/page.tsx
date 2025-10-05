import { PageTitle } from "~/components/ui/PageTitle"

export default function FromHoardsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <PageTitle className="mb-8">From Hoards</PageTitle>
          <div className="artemis-card p-8">
            <h2 className="coin-title mb-4 text-2xl">Under Construction</h2>
            <p className="coin-description text-lg leading-relaxed">
              This page will showcase coins discovered in archaeological hoards.
              Coming soon with detailed information about treasure finds, burial
              contexts, and the historical significance of these remarkable
              discoveries.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
