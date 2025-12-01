"use client"

import { useState } from "react"
import {
  useHistoricalFigures,
  useUpdateHistoricalFigure,
} from "~/api/historical-figures"
import type { HistoricalFigure } from "~/database/schema-historical-figures"
import { EditHistoricalFigureModal } from "./EditHistoricalFigureModal"

export function EditHistoricalFiguresView() {
  const [message, setMessage] = useState<string | null>(null)
  const [nameFilter, setNameFilter] = useState("")
  const [selectedFigureId, setSelectedFigureId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: figuresData, isLoading: loading } = useHistoricalFigures()
  const updateFigureMutation = useUpdateHistoricalFigure()

  const figures = figuresData ?? []

  // Handle modal interactions
  const handleFigureSelect = (figure: HistoricalFigure) => {
    setSelectedFigureId(figure.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedFigureId(null)
  }

  const handleModalSave = async (
    id: number,
    updates: Partial<HistoricalFigure>,
  ) => {
    try {
      await updateFigureMutation.mutateAsync({
        id: id,
        data: updates,
      })
      setMessage("✅ Historical figure updated successfully")
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error saving:", error)
      setMessage("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  // Filter figures based on name, authority, and dynasty
  const filteredFigures = figures.filter((figure) => {
    if (!nameFilter.trim()) return true

    const searchTerm = nameFilter.toLowerCase()

    // Check name, full_name, authority, dynasty
    const nameMatch = figure.name?.toLowerCase().includes(searchTerm) ?? false
    const fullNameMatch =
      figure.full_name?.toLowerCase().includes(searchTerm) ?? false
    const authorityMatch =
      figure.authority?.toLowerCase().includes(searchTerm) ?? false
    const dynastyMatch =
      figure.dynasty?.toLowerCase().includes(searchTerm) ?? false

    return nameMatch || fullNameMatch || authorityMatch || dynastyMatch
  })

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="coin-description text-lg">
          Loading historical figures...
        </p>
      </div>
    )
  }

  if (!figures.length) {
    return (
      <div className="artemis-card p-8 text-center">
        <h3 className="coin-title mb-4 text-xl">No Historical Figures Found</h3>
        <p className="coin-description">
          No historical figures have been created yet.
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
          Filter by Name, Authority, or Dynasty
        </label>
        <input
          id="name-filter"
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by name, authority, dynasty..."
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
        />
        {nameFilter && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredFigures.length} of {figures.length} figures
          </p>
        )}
      </div>

      {filteredFigures.length === 0 && nameFilter ? (
        <div className="artemis-card p-8 text-center">
          <h3 className="coin-title mb-4 text-xl">No Matching Figures</h3>
          <p className="coin-description">
            No figures found matching &ldquo;{nameFilter}&rdquo;
          </p>
        </div>
      ) : (
        // Clean list view for all viewport sizes
        <div className="artemis-card p-6">
          <div className="space-y-3">
            {filteredFigures.map((figure) => (
              <button
                key={figure.id}
                onClick={() => handleFigureSelect(figure)}
                className="w-full rounded-lg border border-gray-200 bg-slate-800 p-4 text-left transition-colors hover:bg-gray-600 hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">
                      {figure.name}
                      {figure.full_name && figure.full_name !== figure.name && (
                        <span className="ml-2 text-sm text-gray-400">
                          ({figure.full_name})
                        </span>
                      )}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>{figure.authority}</span>
                      {figure.dynasty && <span>• {figure.dynasty}</span>}
                      {figure.reign_start && figure.reign_end && (
                        <span>
                          • {figure.reign_start}-{figure.reign_end} CE
                        </span>
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
        </div>
      )}

      {/* Edit Historical Figure Modal */}
      {(() => {
        const selectedFigure = selectedFigureId
          ? (figures.find((figure) => figure.id === selectedFigureId) ?? null)
          : null

        return (
          <EditHistoricalFigureModal
            key={
              selectedFigure
                ? `historical-figure-${selectedFigure.id}-${selectedFigure.created_at}`
                : "no-figure"
            }
            isOpen={isModalOpen}
            onClose={handleModalClose}
            figure={selectedFigure}
            onSave={handleModalSave}
            isSaving={updateFigureMutation.isPending}
          />
        )
      })()}
    </div>
  )
}
