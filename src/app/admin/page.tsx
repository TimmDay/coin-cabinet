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
            {/* Collection Group */}
            <div className="artemis-card p-6">
              <h3 className="coin-title mb-4 text-center text-xl">
                Collection
              </h3>
              <p className="coin-description mb-6 text-center">
                Manage your coin collection
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/add-coin"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Add Coin</div>
                  <div className="text-sm text-slate-400">
                    Add a new coin to your collection
                  </div>
                </a>
                <a
                  href="/admin/edit-somnus"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Edit Somnus</div>
                  <div className="text-sm text-slate-400">
                    Edit existing coins in your collection
                  </div>
                </a>
              </div>
            </div>

            {/* Deities Group */}
            <div className="artemis-card p-6">
              <h3 className="coin-title mb-4 text-center text-xl">Deities</h3>
              <p className="coin-description mb-6 text-center">
                Manage deity information
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/add-deity"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Add Deity</div>
                  <div className="text-sm text-slate-400">
                    Add a new deity to the database
                  </div>
                </a>
                <a
                  href="/admin/edit-deities"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Edit Deities</div>
                  <div className="text-sm text-slate-400">
                    Edit existing deity information
                  </div>
                </a>
              </div>
            </div>

            {/* Places Group */}
            <div className="artemis-card p-6">
              <h3 className="coin-title mb-4 text-center text-xl">Places</h3>
              <p className="coin-description mb-6 text-center">
                Manage historical places
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/add-place"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Add Place</div>
                  <div className="text-sm text-slate-400">
                    Add a new historical place to the database
                  </div>
                </a>
                <a
                  href="/admin/edit-places"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Edit Places</div>
                  <div className="text-sm text-slate-400">
                    Manage historical places and locations
                  </div>
                </a>
              </div>
            </div>

            {/* Mints Group */}
            <div className="artemis-card p-6">
              <h3 className="coin-title mb-4 text-center text-xl">Mints</h3>
              <p className="coin-description mb-6 text-center">
                Manage mint locations
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/add-mint"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Add Mint</div>
                  <div className="text-sm text-slate-400">
                    Add a new mint location to the database
                  </div>
                </a>
                <a
                  href="/admin/edit-mints"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">Edit Mints</div>
                  <div className="text-sm text-slate-400">
                    Manage mint information and locations
                  </div>
                </a>
              </div>
            </div>

            {/* Historical Figures Group */}
            <div className="artemis-card p-6">
              <h3 className="coin-title mb-4 text-center text-xl">
                Historical Figures
              </h3>
              <p className="coin-description mb-6 text-center">
                Manage historical figures
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/add-historical-figure"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">
                    Add Historical Figure
                  </div>
                  <div className="text-sm text-slate-400">
                    Add a new historical figure to the database
                  </div>
                </a>
                <a
                  href="/admin/edit-historical-figures"
                  className="block rounded-lg border border-slate-600 p-3 text-center transition-colors hover:bg-purple-900/10"
                >
                  <div className="font-medium text-slate-200">
                    Edit Historical Figures
                  </div>
                  <div className="text-sm text-slate-400">
                    Edit existing historical figure information
                  </div>
                </a>
              </div>
            </div>

            {/* Other admin functions */}
            <a
              href="/admin/edit-map"
              className="artemis-card p-6 text-center transition-colors hover:bg-purple-900/5"
            >
              <h3 className="coin-title mb-4 text-xl">Edit Map</h3>
              <p className="coin-description">
                Manage map locations and mint data
              </p>
            </a>

            <a
              href="/admin/feature-flags"
              className="artemis-card p-6 text-center transition-colors hover:bg-purple-900/5"
            >
              <h3 className="coin-title mb-4 text-xl">Feature Flags</h3>
              <p className="coin-description">
                Manage feature flags and settings
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
