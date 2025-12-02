"use client"

import { useDeities, useUpdateDeity, useDeleteDeity } from "~/api/deities"
import type { Deity } from "~/database/schema-deities"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditDeityModal } from "./EditDeityModal"

export function EditDeitiesView() {
  const dataQuery = useDeities()
  const updateMutation = useUpdateDeity()
  const deleteMutation = useDeleteDeity()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Deity>()

  // Handle delete
  const handleDelete = async (deity: Deity) => {
    if (!confirm(`Are you sure you want to delete ${deity.name}?`)) return

    try {
      await deleteMutation.mutateAsync(deity.id)
      handleSuccess(`✅ ${deity.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${deity.name}`)
    }
  }

  // Filter deities based on name and god_of domains
  const filterFunction = (item: Deity, filterTerm: string) => {
    if (!filterTerm.trim()) return true

    const searchTerm = filterTerm.toLowerCase()

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
  }

  const renderListItem = (item: Deity) => (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-white">
          {item.name}
          {item.subtitle && (
            <span className="ml-2 text-sm text-gray-300">{item.subtitle}</span>
          )}
        </h3>
        {item.god_of && item.god_of.length > 0 && (
          <p className="text-sm text-gray-400">{item.god_of.join(", ")}</p>
        )}
        {item.alt_names && item.alt_names.length > 0 && (
          <p className="mt-1 text-xs text-gray-400">
            {item.alt_names.join(", ")}
          </p>
        )}
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

  const handleModalSave = async (id: number, updates: Partial<Deity>) => {
    try {
      const formUpdates = {
        ...updates,
        flavour_text:
          updates.flavour_text === null ? undefined : updates.flavour_text,
        secondary_info:
          updates.secondary_info === null ? undefined : updates.secondary_info,
      }

      await updateMutation.mutateAsync({ id, updates: formUpdates })
      handleSuccess("✅ Deity updated successfully")
    } catch (error) {
      console.error("Error saving:", error)
      handleSuccess("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  const renderModal = (selectedDeity: Deity | null) => {
    return (
      <EditDeityModal
        key={
          selectedDeity
            ? `deity-${selectedDeity.id}-${selectedDeity.updated_at}`
            : "no-deity"
        }
        isOpen={isModalOpen}
        onClose={handleModalClose}
        deity={selectedDeity}
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
      filterLabel="Filter by Name, Domains, or Alternative Names"
      filterPlaceholder="Search by name, domain, or alternative name (e.g., Jupiter, thunder, Zeus)..."
      filterFunction={filterFunction}
      renderListItem={renderListItem}
      selectedItemId={selectedItemId}
      onItemSelect={handleItemSelect}
      renderModal={renderModal}
      addNewConfig={{
        label: "Add New Deity",
        href: "/admin/add-deity",
      }}
      emptyStateConfig={{
        title: "No Deities Found",
        description: "The pantheon is empty. Add some deities first!",
        showAddButton: true,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
