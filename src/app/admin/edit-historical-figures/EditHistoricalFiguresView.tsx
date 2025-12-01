"use client"

import {
  useHistoricalFigures,
  useUpdateHistoricalFigure,
} from "~/api/historical-figures"
import type { HistoricalFigure } from "~/database/schema-historical-figures"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditHistoricalFigureModal } from "./EditHistoricalFigureModal"

export function EditHistoricalFiguresView() {
  const dataQuery = useHistoricalFigures()
  const updateMutation = useUpdateHistoricalFigure()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<HistoricalFigure>()

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
    const dynastyMatch =
      figure.dynasty?.toLowerCase().includes(searchTerm) ?? false

    return nameMatch || fullNameMatch || authorityMatch || dynastyMatch
  }

  const renderListItem = (figure: HistoricalFigure) => (
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

  const renderModal = (selectedFigure: HistoricalFigure | null) => {
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
        isSaving={updateMutation.isPending}
      />
    )
  }

  return (
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
      emptyStateConfig={{
        title: "No Historical Figures Found",
        description: "No historical figures have been created yet.",
        showAddButton: false,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
