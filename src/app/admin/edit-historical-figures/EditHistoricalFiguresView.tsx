"use client"

import { useState } from "react"
import {
  useHistoricalFigures,
  useUpdateHistoricalFigure,
  useDeleteHistoricalFigure,
  useAddHistoricalFigure,
} from "~/api/historical-figures"
import type { HistoricalFigure } from "~/database/schema-historical-figures"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditHistoricalFigureModal } from "./EditHistoricalFigureModal"

export function EditHistoricalFiguresView() {
  const dataQuery = useHistoricalFigures()
  const updateMutation = useUpdateHistoricalFigure()
  const deleteMutation = useDeleteHistoricalFigure()
  const addMutation = useAddHistoricalFigure()

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
  } = useEditModal<HistoricalFigure>()

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
  const handleDelete = async (figure: HistoricalFigure) => {
    if (!confirm(`Are you sure you want to delete ${figure.name}?`)) return

    try {
      await deleteMutation.mutateAsync(figure.id)
      handleSuccess(`✅ ${figure.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${figure.name}`)
    }
  }

  // Filter figures based on name, authority, and dynasty
  const filterFunction = (figure: HistoricalFigure, filterTerm: string) => {
    if (!filterTerm.trim()) return true

    const searchTerm = filterTerm.toLowerCase()

    // Check name, full_name, authority, dynasty
    const nameMatch = figure.name?.toLowerCase().includes(searchTerm) ?? false
    const fullNameMatch =
      figure.full_name?.toLowerCase().includes(searchTerm) ?? false
    const authorityMatch =
      figure.authority?.toLowerCase().includes(searchTerm) ?? false
    const altNamesMatch =
      figure.altNames?.some((name) =>
        name.toLowerCase().includes(searchTerm),
      ) ?? false

    return nameMatch || fullNameMatch || authorityMatch || altNamesMatch
  }

  const renderListItem = (figure: HistoricalFigure) => (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
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
          {figure.altNames && figure.altNames.length > 0 && (
            <span>• {figure.altNames.join(", ")}</span>
          )}
          {figure.reign_start && figure.reign_end && (
            <span>
              • {figure.reign_start}-{figure.reign_end} CE
            </span>
          )}
        </div>
      </div>
      {(!figure.historical_sources ||
        figure.historical_sources.length === 0) && (
        <span className="mr-3 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
          needs sources
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          void handleDelete(figure)
        }}
        className="mr-3 rounded p-1 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
        title={`Delete ${figure.name}`}
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
    id: number,
    updates: Partial<HistoricalFigure>,
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: id,
        data: updates,
      })
      handleSuccess("✅ Historical figure updated successfully")
    } catch (error) {
      console.error("Error saving:", error)
      handleSuccess("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  const handleCreateSave = async (
    id: number,
    data: Partial<HistoricalFigure>,
  ) => {
    try {
      await addMutation.mutateAsync(
        data as Omit<
          HistoricalFigure,
          "id" | "created_at" | "updated_at" | "user_id"
        >,
      )
      handleCreateSuccess("✅ Historical figure added successfully")
    } catch (error) {
      console.error("Error adding historical figure:", error)
      throw error // Re-throw so modal can handle it
    }
  }

  const renderModal = (selectedFigure: HistoricalFigure | null) => {
    return (
      <>
        {/* Edit Modal */}
        {selectedFigure && (
          <EditHistoricalFigureModal
            key={
              selectedFigure
                ? `historical-figure-${selectedFigure.id}-${selectedFigure.created_at}`
                : "no-figure"
            }
            isOpen={isModalOpen}
            onClose={handleModalClose}
            entity={selectedFigure}
            onSave={handleModalSave}
            isSaving={updateMutation.isPending}
          />
        )}
      </>
    )
  }

  // Render create modal separately - always available
  const CreateModal = () => (
    <EditHistoricalFigureModal
      isOpen={isCreateModalOpen}
      onClose={handleCreateModalClose}
      entity={null}
      onSave={handleCreateSave}
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
        filterLabel="Filter by Name, Authority, or Dynasty"
        filterPlaceholder="Search by name, authority, dynasty..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Historical Figure",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Historical Figures Found",
          description: "No historical figures have been created yet.",
          showAddButton: true,
        }}
        message={displayMessage}
        onSuccess={handleSuccess}
      />
      <CreateModal />
    </>
  )
}
