"use client"

import { useEffect, useState } from "react"
import { useAllSomnusCoins, useUpdateSomnusCoin } from "~/api/somnus-collection"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import { EditCoinModal } from "./EditCoinModal"

export function EditSomnusView() {
  const [message, setMessage] = useState<string | null>(null)
  const [nicknameFilter, setNicknameFilter] = useState("")
  const [selectedCoinId, setSelectedCoinId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: somnusData, isLoading: loading, error } = useAllSomnusCoins()
  const updateCoinMutation = useUpdateSomnusCoin()

  // Handle errors
  useEffect(() => {
    if (error) {
      setMessage("❌ Failed to load Somnus collection")
    }
  }, [error])

  const items = somnusData ?? []

  // Handle modal interactions
  const handleCoinSelect = (coin: SomnusCollection) => {
    setSelectedCoinId(coin.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCoinId(null)
  }

  const handleModalSave = async (
    id: number,
    updates: Partial<SomnusCollection>,
  ) => {
    try {
      await updateCoinMutation.mutateAsync({
        id: id,
        data: updates,
      })
      setMessage("✅ Item updated successfully")
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error saving:", error)
      setMessage("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  // Filter items based on nickname and devices
  const filteredItems = items.filter((item) => {
    if (!nicknameFilter.trim()) return true

    const searchTerm = nicknameFilter.toLowerCase()

    // Check nickname
    const nicknameMatch =
      item.nickname?.toLowerCase().includes(searchTerm) ?? false

    // Check devices array
    const devicesMatch =
      item.devices?.some((device: string) =>
        device.toLowerCase().includes(searchTerm),
      ) ?? false

    return nicknameMatch || devicesMatch
  })

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="coin-description text-lg">Loading Somnus collection...</p>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="artemis-card p-8 text-center">
        <h3 className="coin-title mb-4 text-xl">No Items Found</h3>
        <p className="coin-description">Your Somnus collection is empty.</p>
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
        <label
          htmlFor="nickname-filter"
          className="mb-2 block text-sm font-medium"
        >
          Filter by Nickname or Devices
        </label>
        <input
          id="nickname-filter"
          type="text"
          value={nicknameFilter}
          onChange={(e) => setNicknameFilter(e.target.value)}
          placeholder="Search by nickname or device (e.g., victoria, mars)..."
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
        />
        {nicknameFilter && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </p>
        )}
      </div>

      {filteredItems.length === 0 && nicknameFilter ? (
        <div className="artemis-card p-8 text-center">
          <h3 className="coin-title mb-4 text-xl">No Matching Items</h3>
          <p className="coin-description">
            No items found matching &ldquo;{nicknameFilter}&rdquo;
          </p>
        </div>
      ) : (
        // Clean list view for all viewport sizes
        <div className="artemis-card p-6">
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCoinSelect(item)}
                className="w-full rounded-lg border border-gray-200 bg-slate-800 p-4 text-left transition-colors hover:bg-gray-600 hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">
                      {item.nickname || "Unnamed Coin"}
                    </h3>
                    {item.devices && item.devices.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Devices: {item.devices.join(", ")}
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

      {/* Edit Coin Modal */}
      {(() => {
        const selectedCoin = selectedCoinId
          ? (items.find((item) => item.id === selectedCoinId) ?? null)
          : null

        return (
          <EditCoinModal
            key={
              selectedCoin
                ? `somnus-coin-${selectedCoin.id}-${selectedCoin.created_at}`
                : "no-coin"
            }
            isOpen={isModalOpen}
            onClose={handleModalClose}
            coin={selectedCoin}
            onSave={handleModalSave}
            isSaving={updateCoinMutation.isPending}
          />
        )
      })()}
    </div>
  )
}
