"use client"

import { useEffect, useState } from "react"
import { useDeities, useUpdateDeity } from "~/api/deities"
import { Loading } from "~/components/ui/Loading"
import type { Deity } from "~/database/schema-deities"
import { EditDeityModal } from "./EditDeityModal"

export function EditDeitiesView() {
  const [items, setItems] = useState<Deity[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [nameFilter, setNameFilter] = useState("")
  const [selectedDeity, setSelectedDeity] = useState<Deity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: deitiesData, isLoading: loading, error } = useDeities()
  const updateDeityMutation = useUpdateDeity()

  // Transform data when it loads
  useEffect(() => {
    if (deitiesData) {
      setItems(deitiesData)
    }
  }, [deitiesData])

  // Handle errors
  useEffect(() => {
    if (error) {
      setMessage("❌ Failed to load deities")
    }
  }, [error])

  // Handle modal interactions
  const handleDeitySelect = (deity: Deity) => {
    setSelectedDeity(deity)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedDeity(null)
  }

  const handleModalSave = async (id: number, updates: Partial<Deity>) => {
    try {
      const formUpdates = {
        ...updates,
        flavour_text:
          updates.flavour_text === null ? undefined : updates.flavour_text,
        secondary_info:
          updates.secondary_info === null ? undefined : updates.secondary_info,
      }

      await updateDeityMutation.mutateAsync({ id, updates: formUpdates })
      setMessage("✅ Deity updated successfully")
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error saving:", error)
      setMessage("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  // Filter deities based on name and god_of domains
  const filteredItems = items.filter((item) => {
    if (!nameFilter.trim()) return true

    const searchTerm = nameFilter.toLowerCase()

    // Check name
    const nameMatch = item.name?.toLowerCase().includes(searchTerm) ?? false

    // Check god_of domains
    const domainMatch =
      item.god_of?.some((domain: string) =>
        domain.toLowerCase().includes(searchTerm),
      ) ?? false

    // Check alt_names
    const altNameMatch =
      item.alt_names?.some((altName: string) =>
        altName.toLowerCase().includes(searchTerm),
      ) ?? false

    return nameMatch || domainMatch || altNameMatch
  })

  if (loading) {
    return <Loading variant="component" message="Loading deities..." />
  }

  if (!items.length) {
    return (
      <div className="artemis-card p-8 text-center">
        <h3 className="coin-title mb-4 text-xl">No Deities Found</h3>
        <p className="coin-description">
          The pantheon is empty. Add some deities first!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="artemis-card p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}

      {/* Filter Input */}
      <div className="artemis-card p-4">
        <label htmlFor="name-filter" className="mb-2 block text-sm font-medium">
          Filter by Name, Domains, or Alternative Names
        </label>
        <input
          id="name-filter"
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by name, domain, or alternative name (e.g., Jupiter, thunder, Zeus)..."
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
        />
        {nameFilter && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} deities
          </p>
        )}
      </div>

      {filteredItems.length === 0 && nameFilter ? (
        <div className="artemis-card p-8 text-center">
          <h3 className="coin-title mb-4 text-xl">No Matching Deities</h3>
          <p className="coin-description">
            No deities found matching &ldquo;{nameFilter}&rdquo;
          </p>
        </div>
      ) : (
        // Clean list view for all viewport sizes
        <div className="artemis-card p-6">
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleDeitySelect(item)}
                className="w-full rounded-lg border border-gray-200 bg-slate-800 p-4 text-left transition-colors hover:bg-gray-600 hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">
                      {item.name}
                      {item.subtitle && (
                        <span className="ml-2 text-sm text-gray-300">
                          ({item.subtitle})
                        </span>
                      )}
                    </h3>
                    {item.god_of && item.god_of.length > 0 && (
                      <p className="text-sm text-gray-400">
                        God of: {item.god_of.join(", ")}
                      </p>
                    )}
                    {item.alt_names && item.alt_names.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Also known as: {item.alt_names.join(", ")}
                      </p>
                    )}
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
        </div>
      )}

      {/* Edit Deity Modal */}
      <EditDeityModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        deity={selectedDeity}
        onSave={handleModalSave}
        isSaving={updateDeityMutation.isPending}
      />
    </div>
  )
}
