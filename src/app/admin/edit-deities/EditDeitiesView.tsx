"use client"

import { useDeities, useUpdateDeity } from "~/api/deities"
import type { Deity } from "~/database/schema-deities"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditDeityModal } from "./EditDeityModal"

export function EditDeitiesView() {
  const dataQuery = useDeities()
  const updateMutation = useUpdateDeity()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Deity>()

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
    <div>
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
      emptyStateConfig={{
        title: "No Deities Found",
        description: "The pantheon is empty. Add some deities first!",
        showAddButton: false,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
