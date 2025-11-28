import { PageTitle } from "~/components/ui/PageTitle"

type AuthRequiredPageProps = {
  pageTitle: string
  description?: string
}

export function AuthRequiredPage({
  pageTitle,
  description = "Please sign in to access this page.",
}: AuthRequiredPageProps) {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            {pageTitle}
          </PageTitle>
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="artemis-card p-8 text-center">
            <h2 className="coin-title mb-4 text-2xl font-semibold">
              Authentication Required
            </h2>
            <p className="coin-description mb-6 text-lg">{description}</p>
            <a
              href="/somnus-login"
              className="artemis-button inline-block px-6 py-3 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
