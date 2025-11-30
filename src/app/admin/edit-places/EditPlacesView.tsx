"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePlaces } from "~/api/places"
import { EditPlaceModal } from "~/app/admin/edit-places/EditPlaceModal"
import type { Place } from "~/database/schema-places"

export function EditPlacesView() {
  const [message, setMessage] = useState<string | null>(null)
  const [nameFilter, setNameFilter] = useState("")
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: placesData, isLoading: loading, error } = usePlaces()

  // Handle errors
  useEffect(() => {
    if (error) {
      setMessage("❌ Failed to load places")
    }
  }, [error])

  const items = placesData ?? []

  // Handle modal interactions
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlaceId(place.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPlaceId(null)
    setMessage("✅ Place updated successfully")
    setTimeout(() => setMessage(null), 3000)
  }

  // Filter places based on search term
  const filteredItems = items.filter((place) => {
    const searchTerm = nameFilter.toLowerCase()
    const altNamesMatch =
      place.alt_names?.some((alt: string) =>
        alt.toLowerCase().includes(searchTerm),
      ) ?? false
    const locationMatch =
      place.location_description?.toLowerCase().includes(searchTerm) ?? false

    return (
      place.name.toLowerCase().includes(searchTerm) ||
      altNamesMatch ||
      place.kind.toLowerCase().includes(searchTerm) ||
      locationMatch
    )
  })

  return (
    <div className="space-y-6">
      {message && (
        <div className="somnus-card p-4 text-center">
          <p className="text-lg font-medium text-slate-200">{message}</p>
        </div>
      )}

      {/* Filter Input */}
      <div className="somnus-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md flex-1">
            <label
              htmlFor="place-filter"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Filter by Name, Kind, or Location
            </label>
            <input
              id="place-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search by name, kind, or location (e.g., Rome, temple, Palatine Hill)..."
              className="w-full rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-200 placeholder-slate-400 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
            />
            {nameFilter && (
              <p className="mt-2 text-sm text-slate-400">
                Showing {filteredItems.length} of {items.length} places
              </p>
            )}
          </div>

          <Link href="/admin/add-place">
            <button className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none">
              Add New Place
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="somnus-card p-8 text-center">
          <p className="text-lg text-slate-200">Loading places...</p>
        </div>
      ) : filteredItems.length === 0 && nameFilter ? (
        <div className="somnus-card p-8 text-center">
          <h3 className="mb-4 text-xl font-semibold text-slate-200">
            No Matching Places
          </h3>
          <p className="text-slate-400">
            No places found matching &ldquo;{nameFilter}&rdquo;
          </p>
        </div>
      ) : (
        // Clean list view for all viewport sizes
        <div className="somnus-card p-6">
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePlaceSelect(item)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 p-4 text-left transition-colors hover:bg-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-200">
                      {item.name}
                      {item.alt_names && item.alt_names.length > 0 && (
                        <span className="ml-2 text-sm text-slate-400">
                          ({item.alt_names.join(", ")})
                        </span>
                      )}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-slate-400">
                        {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}{" "}
                        • {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                      </p>
                      {item.location_description && (
                        <p className="text-sm text-slate-500">
                          {item.location_description}
                        </p>
                      )}
                      {item.established_year && (
                        <p className="text-xs text-slate-500">
                          Established:{" "}
                          {item.established_year > 0
                            ? `${item.established_year} AD`
                            : `${Math.abs(item.established_year)} BC`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-slate-400">
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
              <h3 className="mb-4 text-xl font-semibold text-slate-200">
                No Places Yet
              </h3>
              <p className="mb-6 text-slate-400">
                Start by adding your first historical place.
              </p>
              <Link href="/admin/add-place">
                <button className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none">
                  Add Your First Place
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Place Modal */}
      {(() => {
        const selectedPlace = selectedPlaceId
          ? (items.find((item) => item.id === selectedPlaceId) ?? null)
          : null

        return selectedPlace ? (
          <EditPlaceModal
            key={`place-${selectedPlace.id}-${selectedPlace.updated_at}`}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            place={selectedPlace}
          />
        ) : null
      })()}
    </div>
  )
}
