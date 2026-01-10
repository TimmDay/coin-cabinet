"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { GenericEditView } from "~/components/admin/GenericEditView"
import type { Artifact } from "~/database/schema-artifacts"
import { useEditModal } from "~/hooks/useEditModal"
import type { ArtifactFormData } from "~/lib/validations/artifact-form"
import { EditArtifactModal } from "./EditArtifactModal"

// API functions
async function fetchArtifacts(): Promise<Artifact[]> {
  const response = await fetch("/api/artifacts/admin")
  if (!response.ok) {
    throw new Error("Failed to fetch artifacts")
  }
  return response.json() as Promise<Artifact[]>
}

async function createArtifact(data: ArtifactFormData): Promise<Artifact> {
  const response = await fetch("/api/artifacts/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create artifact")
  }
  return response.json() as Promise<Artifact>
}

async function updateArtifact(
  id: string,
  data: ArtifactFormData,
): Promise<Artifact> {
  const response = await fetch("/api/artifacts/admin", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  })
  if (!response.ok) {
    throw new Error("Failed to update artifact")
  }
  return response.json() as Promise<Artifact>
}

async function deleteArtifact(id: string): Promise<void> {
  const response = await fetch(`/api/artifacts/admin?id=${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete artifact")
  }
}

export function EditArtifactsView() {
  const queryClient = useQueryClient()

  const dataQuery = useQuery({
    queryKey: ["artifacts"],
    queryFn: fetchArtifacts,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArtifactFormData }) =>
      updateArtifact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifacts"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteArtifact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifacts"] })
    },
  })

  const addMutation = useMutation({
    mutationFn: createArtifact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifacts"] })
    },
  })

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
  } = useEditModal<Artifact>()

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
  const handleDelete = async (artifact: Artifact) => {
    if (!confirm(`Are you sure you want to delete ${artifact.name}?`)) return

    try {
      await deleteMutation.mutateAsync(artifact.id)
      handleSuccess(`✅ ${artifact.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${artifact.name}`)
    }
  }

  // Filter artifacts based on name, institution, location, and medium
  const filterFunction = (item: Artifact, filterTerm: string) => {
    if (!filterTerm.trim()) return true

    const searchTerm = filterTerm.toLowerCase()

    // Check name
    const nameMatch = item.name?.toLowerCase().includes(searchTerm) ?? false

    // Check institution
    const institutionMatch =
      item.institution_name?.toLowerCase().includes(searchTerm) ?? false

    // Check location
    const locationMatch =
      item.location_name?.toLowerCase().includes(searchTerm) ?? false

    // Check medium
    const mediumMatch = item.medium?.toLowerCase().includes(searchTerm) ?? false

    return nameMatch || institutionMatch || locationMatch || mediumMatch
  }

  const renderListItem = (item: Artifact) => (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-white">{item.name}</h3>
        {item.institution_name && (
          <p className="text-sm text-gray-400">{item.institution_name}</p>
        )}
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
          {item.location_name && <span>{item.location_name}</span>}
          {item.medium && <span>• {item.medium}</span>}
          {item.year_of_creation_estimate && (
            <span>• {item.year_of_creation_estimate} AD</span>
          )}
        </div>
      </div>
      {(!item.historical_sources || item.historical_sources.length === 0) && (
        <span className="mr-3 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
          needs sources
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          void handleDelete(item)
        }}
        className="mr-3 rounded p-1 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
        title={`Delete ${item.name}`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )

  const handleModalSave = async (
    id: string | null,
    updates: ArtifactFormData,
  ) => {
    if (!id) throw new Error("ID is required for updates")

    try {
      await updateMutation.mutateAsync({ id, data: updates })
      handleSuccess("✅ Artifact updated successfully")
    } catch (error) {
      console.error("Error saving:", error)
      handleSuccess("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  const handleCreateSave = async (updates: ArtifactFormData) => {
    try {
      await addMutation.mutateAsync(updates)
      handleCreateSuccess("✅ Artifact created successfully")
    } catch (error) {
      console.error("Error creating artifact:", error)
      handleCreateSuccess("❌ Failed to create artifact")
      throw error
    }
  }

  const renderModal = (selectedItem: Artifact | null) => (
    <EditArtifactModal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      artifact={selectedItem}
      onSave={handleModalSave}
      isSaving={updateMutation.isPending}
    />
  )

  const CreateModal = () => (
    <EditArtifactModal
      isOpen={isCreateModalOpen}
      onClose={handleCreateModalClose}
      artifact={null}
      onSave={async (_, updates) => handleCreateSave(updates)}
      isSaving={addMutation.isPending}
    />
  )

  // Show create message if available, otherwise show edit message
  const displayMessage = createMessage || message

  return (
    <>
      <GenericEditView
        dataQuery={dataQuery}
        cardClass="artemis-card"
        itemColorScheme="slate"
        filterLabel="Filter by Name, Institution, Location, or Medium"
        filterPlaceholder="Search by name, institution, location, or medium..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Artifact",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Artifacts Found",
          description:
            "No artifacts in the collection. Add some artifacts first!",
          showAddButton: true,
        }}
        message={displayMessage}
        onSuccess={handleSuccess}
      />
      <CreateModal />
    </>
  )
}
