"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useMints, useUpdateMint } from "~/api/mints"
import type { Mint } from "~/database/schema-mints"
import { EditMintModal } from "./EditMintModal"

export function EditMintsView() {
  const [message, setMessage] = useState<string | null>(null)
  const [nameFilter, setNameFilter] = useState("")
  const [selectedMintId, setSelectedMintId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: mintsData, isLoading: loading, error } = useMints()
  const updateMintMutation = useUpdateMint()

  // Handle errors
  useEffect(() => {
    if (error) {
      setMessage("❌ Failed to load mints")
    }
  }, [error])

  const items = mintsData ?? []

  // Handle modal interactions
  const handleMintSelect = (mint: Mint) => {
    setSelectedMintId(mint.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedMintId(null)
  }

  const handleSuccess = (successMessage: string) => {
    setMessage(successMessage)
    setTimeout(() => setMessage(null), 3000)
  }

  // Filter mints based on search term
  const filteredItems = items.filter(
    (mint) =>
      mint.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
      (mint.alt_names?.some((alt) =>
        alt.toLowerCase().includes(nameFilter.toLowerCase()),
      ) ??
        false) ||
      (mint.opened_by?.toLowerCase().includes(nameFilter.toLowerCase()) ??
        false),
  )

  return (
    <div className="space-y-6">
      {message && (
        <div className="artemis-card p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}

      {/* Filter Input */}
      <div className="artemis-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md flex-1">
            <label
              htmlFor="mint-filter"
              className="mb-2 block text-sm font-medium"
            >
              Filter by Name, Location, or Mint Marks
            </label>
            <input
              id="mint-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search by name, location, or mint marks (e.g., Rome, ROMA, Augustus)..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
            />
            {nameFilter && (
              <p className="mt-2 text-sm text-gray-600">
                Showing {filteredItems.length} of {items.length} mints
              </p>
            )}
          </div>

          <Link href="/admin/add-mint">
            <button className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none">
              Add New Mint
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="artemis-card p-8 text-center">
          <p className="text-lg">Loading mints...</p>
        </div>
      ) : filteredItems.length === 0 && nameFilter ? (
        <div className="artemis-card p-8 text-center">
          <h3 className="coin-title mb-4 text-xl">No Matching Mints</h3>
          <p className="coin-description">
            No mints found matching &ldquo;{nameFilter}&rdquo;
          </p>
        </div>
      ) : (
        // Clean list view for all viewport sizes
        <div className="artemis-card p-6">
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMintSelect(item)}
                className="w-full rounded-lg border border-gray-200 bg-slate-800 p-4 text-left transition-colors hover:bg-gray-600 hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {item.name}
                      {item.alt_names && item.alt_names.length > 0 && (
                        <span className="ml-2 text-sm text-gray-300">
                          ({item.alt_names.join(", ")})
                        </span>
                      )}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-400">
                        {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                      </p>
                      {item.opened_by && (
                        <p className="text-sm text-gray-400">
                          Opened by {item.opened_by}
                        </p>
                      )}
                      {item.mint_marks && item.mint_marks.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {item.mint_marks.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && !nameFilter && (
            <div className="py-8 text-center">
              <h3 className="coin-title mb-4 text-xl">No Mints Yet</h3>
              <p className="coin-description mb-6">
                Start by adding your first mint location.
              </p>
              <Link href="/admin/add-mint">
                <button className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none">
                  Add Your First Mint
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Mint Modal */}
      {(() => {
        const selectedMint = selectedMintId
          ? (items.find((item) => item.id === selectedMintId) ?? null)
          : null

        return selectedMint ? (
          <EditMintModal
            key={`mint-${selectedMint.id}-${selectedMint.updated_at}`}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            mint={selectedMint}
            onSuccess={handleSuccess}
            isSaving={updateMintMutation.isPending}
          />
        ) : null
      })()}
    </div>
  )
}
