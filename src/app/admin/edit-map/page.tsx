"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "~/components/providers/auth-provider"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditMapPage() {
  const { user, loading } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [message, setMessage] = useState("")
  const queryClient = useQueryClient()

  const handleRefreshCache = async () => {
    setIsRefreshing(true)
    try {
      console.log("🔄 Refresh cache button clicked (edit-map)")

      // Aggressive cache clearing for JSONB data
      queryClient.removeQueries({ queryKey: ["timelines"] })

      // Invalidate all other queries
      await queryClient.invalidateQueries()

      // Force fresh timeline data from server
      await queryClient.refetchQueries({ queryKey: ["timelines"] })

      console.log("✅ Cache refresh completed (edit-map)")
      setMessage("✅ Cache refreshed successfully")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error refreshing cache:", error)
      setMessage("❌ Failed to refresh cache")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsRefreshing(false)
    }
  }

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
            <p className="coin-description">
              Map editing functionality coming soon...
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-300">{message}</p>
            </div>
          )}

          {/* Refresh Cache Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleRefreshCache}
              disabled={isRefreshing}
              className="rounded-md bg-purple-700 px-6 py-2 text-white opacity-75 transition-all hover:bg-purple-600 hover:opacity-100 disabled:opacity-50"
            >
              {isRefreshing ? "Refreshing..." : "Refresh Cache"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
