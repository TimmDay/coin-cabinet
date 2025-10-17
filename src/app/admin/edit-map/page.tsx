"use client"

import { useAuth } from "~/components/providers/auth-provider"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditMapPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="coin-description text-xl">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <PageTitle authPage className="mb-6">
              Edit Map
            </PageTitle>
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="artemis-card p-8 text-center">
              <h2 className="coin-title mb-4 text-2xl font-semibold">
                Authentication Required
              </h2>
              <p className="coin-description mb-6 text-lg">
                Please sign in to edit map data.
              </p>
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

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Edit Map
          </PageTitle>
          <p className="coin-description text-xl">
            Manage map locations and mint data
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="artemis-card p-8 text-center">
            <h3 className="coin-title mb-4 text-xl">Edit Map</h3>
            <p className="coin-description">Map editing functionality coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  )
}