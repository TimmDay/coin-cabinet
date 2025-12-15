"use client"

import { useState } from "react"
import { usePlaces, useDeletePlace, useAddPlace } from "~/api/places"
import { EditPlaceModal } from "~/app/admin/edit-places/EditPlaceModal"
import type { Place } from "~/database/schema-places"
import {
  placeFormSchema,
  type PlaceFormInputData,
} from "~/lib/validations/place-form"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { Trash2 } from "lucide-react"

export function EditPlacesView() {
  const dataQuery = usePlaces()
  const deleteMutation = useDeletePlace()
  const addMutation = useAddPlace()

  // State for create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createMessage, setCreateMessage] = useState("")

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Place>()

  // Handle create modal
  const handleCreateModalOpen = () => setIsCreateModalOpen(true)
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false)
    setCreateMessage("")
  }
  const handleCreateSuccess = (message: string) => {
    setCreateMessage(message)
    setTimeout(() => setCreateMessage(""), 3000)
  }

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
            {item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
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
        <>
          <span className="mr-3 hidden rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400 sm:block">
            needs sources
          </span>
          <span className="mr-3 flex items-center justify-center rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400 sm:hidden">
            NS
          </span>
        </>
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

  const handleCreateSave = async (data: PlaceFormInputData) => {
    try {
      // Transform the form data using the schema
      const transformedData = placeFormSchema.parse(data)
      await addMutation.mutateAsync(transformedData)
      handleCreateSuccess("✅ Place added successfully")
    } catch (error) {
      console.error("Error adding place:", error)
      throw error // Re-throw so modal can handle it
    }
  }

  const renderModal = (selectedPlace: Place | null) => {
    return (
      <>
        {/* Edit Modal */}
        {selectedPlace && (
          <EditPlaceModal
            key={`place-${selectedPlace.id}-${selectedPlace.updated_at}`}
            isOpen={isModalOpen}
            onClose={handleModalCloseWithSuccess}
            place={selectedPlace}
            mode="edit"
          />
        )}
      </>
    )
  }

  // Render create modal separately - always available
  const CreateModal = () => (
    <EditPlaceModal
      isOpen={isCreateModalOpen}
      onClose={handleCreateModalClose}
      place={null}
      onSave={handleCreateSave}
      isSaving={addMutation.isPending}
      mode="create"
    />
  )

  return (
    <>
      <GenericEditView
        dataQuery={dataQuery}
        cardClass="artemis-card"
        itemColorScheme="slate"
        filterLabel="Filter by Name, Kind, or Location"
        filterPlaceholder="Search by name, kind, or location (e.g., Rome, temple, Palatine Hill)..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Place",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Places Yet",
          description: "Start by adding your first historical place.",
          showAddButton: true,
        }}
        message={createMessage || message}
        onSuccess={handleSuccess}
      />
      <CreateModal />
    </>
  )
}
