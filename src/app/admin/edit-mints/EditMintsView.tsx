"use client"

import { useState } from "react"
import { useMints, useUpdateMint, useDeleteMint } from "~/api/mints"
import type { Mint } from "~/database/schema-mints"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditMintModal } from "./EditMintModal"

export function EditMintsView() {
  const dataQuery = useMints()
  const updateMutation = useUpdateMint()
  const deleteMutation = useDeleteMint()

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
  } = useEditModal<Mint>()

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
  const handleDelete = async (mint: Mint) => {
    if (!confirm(`Are you sure you want to delete ${mint.name}?`)) return

    try {
      await deleteMutation.mutateAsync(mint.id)
      handleSuccess(`✅ ${mint.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${mint.name}`)
    }
  }

  // Filter mints based on search term
  const filterFunction = (mint: Mint, filterTerm: string) =>
    mint.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
    (mint.alt_names?.some((alt) =>
      alt.toLowerCase().includes(filterTerm.toLowerCase()),
    ) ??
      false) ||
    (mint.opened_by?.toLowerCase().includes(filterTerm.toLowerCase()) ?? false)

  const renderListItem = (mint: Mint) => (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
        <h3 className="font-medium text-white">
          {mint.name}
          {mint.alt_names && mint.alt_names.length > 0 && (
            <span className="ml-2 text-sm text-gray-300">
              ({mint.alt_names.join(", ")})
            </span>
          )}
        </h3>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-gray-400">
            {mint.lat.toFixed(4)}, {mint.lng.toFixed(4)}
          </p>
          {mint.opened_by && (
            <p className="text-sm text-gray-400">Opened by {mint.opened_by}</p>
          )}
          {mint.mint_marks && mint.mint_marks.length > 0 && (
            <p className="text-xs text-gray-500">
              {mint.mint_marks.join(", ")}
            </p>
          )}
        </div>
      </div>
      {(!mint.historical_sources || mint.historical_sources.length === 0) && (
        <span className="mr-3 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
          needs sources
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          void handleDelete(mint)
        }}
        className="mr-3 rounded p-1 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
        title={`Delete ${mint.name}`}
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

  const renderModal = (selectedMint: Mint | null) => {
    return (
      <>
        {/* Edit Modal */}
        {selectedMint && (
          <EditMintModal
            key={`mint-${selectedMint.id}-${selectedMint.updated_at}`}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            mint={selectedMint}
            onSuccess={handleSuccess}
            isSaving={updateMutation.isPending}
            mode="edit"
          />
        )}
      </>
    )
  }

  // Render create modal separately - always available
  const CreateModal = () => (
    <EditMintModal
      isOpen={isCreateModalOpen}
      onClose={handleCreateModalClose}
      mint={null}
      onSuccess={handleCreateSuccess}
      isSaving={false}
      mode="create"
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
        filterLabel="Filter by Name, Location, or Mint Marks"
        filterPlaceholder="Search by name, location, or mint marks (e.g., Rome, ROMA, Augustus)..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Mint",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Mints Yet",
          description: "Start by adding your first mint location.",
          showAddButton: true,
        }}
        message={displayMessage}
        onSuccess={handleSuccess}
      />
      <CreateModal />
    </>
  )
}
