"use client"

import { useAuth } from "~/components/providers/auth-provider"
import { PageTitle } from "~/components/ui/PageTitle"

export default function AdminPage() {
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
              Admin Panel
            </PageTitle>
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="artemis-card p-8 text-center">
              <h2 className="coin-title mb-4 text-2xl font-semibold">
                Authentication Required
              </h2>
              <p className="coin-description mb-6 text-lg">
                Please sign in to access the admin panel.
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
            Admin Panel
          </PageTitle>
          <p className="coin-description text-xl">
            Choose an admin function from the navigation menu above
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <a
              href="/admin/add-coin"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Add Coin</h3>
              <p className="coin-description">
                Add a new coin to your collection
              </p>
            </a>

            <a
              href="/admin/edit-somnus"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Edit Somnus</h3>
              <p className="coin-description">
                Edit existing coins in your Somnus collection
              </p>
            </a>

            <a
              href="/admin/edit-map"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Edit Map</h3>
              <p className="coin-description">
                Manage map locations and mint data
              </p>
            </a>

            <a
              href="/admin/add-deity"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Add Deity</h3>
              <p className="coin-description">
                Add a new deity to the database
              </p>
            </a>

            <a
              href="/admin/edit-deities"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Edit Deities</h3>
              <p className="coin-description">
                Edit existing deity information
              </p>
            </a>

            <a
              href="/admin/add-mint"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Add Mint</h3>
              <p className="coin-description">
                Add a new mint location to the database
              </p>
            </a>

            <a
              href="/admin/edit-mints"
              className="artemis-card p-6 text-center transition-colors hover:bg-amber-500/5"
            >
              <h3 className="coin-title mb-4 text-xl">Edit Mints</h3>
              <p className="coin-description">
                Manage mint information and locations
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
