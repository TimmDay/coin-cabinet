"use client"

import { usePlaces, useDeletePlace } from "~/api/places"
import { EditPlaceModal } from "~/app/admin/edit-places/EditPlaceModal"
import type { Place } from "~/database/schema-places"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { Trash2 } from "lucide-react"

export function EditPlacesView() {
  const dataQuery = usePlaces()
  const deleteMutation = useDeletePlace()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Place>()

  // Handle delete
  const handleDelete = async (place: Place) => {
    if (!confirm(`Are you sure you want to delete ${place.name}?`)) return

    try {
      await deleteMutation.mutateAsync(place.id)
      handleSuccess(`✅ ${place.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${place.name}`)
    }
  }

  // Filter places based on search term
  const filterFunction = (place: Place, filterTerm: string) => {
    const searchTerm = filterTerm.toLowerCase()
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
  }

  const renderListItem = (item: Place) => (
    <div className="flex w-full items-center justify-between">
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
            {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)} •{" "}
            {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
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
      {(!item.historical_sources || item.historical_sources.trim() === "") && (
        <span className="mr-3 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
          needs sources
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          void handleDelete(item)
        }}
        className="mr-3 rounded p-1.5 text-gray-400 hover:bg-red-500/20 hover:text-red-300"
        title={`Delete ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )

  const handleModalCloseWithSuccess = () => {
    handleModalClose()
    handleSuccess("✅ Place updated successfully")
  }

  const renderModal = (selectedPlace: Place | null) => {
    return selectedPlace ? (
      <EditPlaceModal
        key={`place-${selectedPlace.id}-${selectedPlace.updated_at}`}
        isOpen={isModalOpen}
        onClose={handleModalCloseWithSuccess}
        place={selectedPlace}
      />
    ) : null
  }

  return (
    <GenericEditView
      dataQuery={dataQuery}
      cardClass="somnus-card"
      itemColorScheme="slate"
      filterLabel="Filter by Name, Kind, or Location"
      filterPlaceholder="Search by name, kind, or location (e.g., Rome, temple, Palatine Hill)..."
      filterFunction={filterFunction}
      renderListItem={renderListItem}
      selectedItemId={selectedItemId}
      onItemSelect={handleItemSelect}
      renderModal={renderModal}
      // addNewConfig={{
      //   label: "Add New Place",
      //   href: "/admin/add-place", // TODO: Add create modal functionality
      // }}
      emptyStateConfig={{
        title: "No Places Yet",
        description: "Start by adding your first historical place.",
        showAddButton: true,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
