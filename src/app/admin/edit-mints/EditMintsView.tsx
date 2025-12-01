"use client"

import { useMints, useUpdateMint } from "~/api/mints"
import type { Mint } from "~/database/schema-mints"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditMintModal } from "./EditMintModal"

export function EditMintsView() {
  const dataQuery = useMints()
  const updateMutation = useUpdateMint()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Mint>()

  // Filter mints based on search term
  const filterFunction = (mint: Mint, filterTerm: string) =>
    mint.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
    (mint.alt_names?.some((alt) =>
      alt.toLowerCase().includes(filterTerm.toLowerCase()),
    ) ??
      false) ||
    (mint.opened_by?.toLowerCase().includes(filterTerm.toLowerCase()) ?? false)

  const renderListItem = (mint: Mint) => (
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
          <p className="text-xs text-gray-500">{mint.mint_marks.join(", ")}</p>
        )}
      </div>
    </div>
  )

  const renderModal = (selectedMint: Mint | null) => {
    return selectedMint ? (
      <EditMintModal
        key={`mint-${selectedMint.id}-${selectedMint.updated_at}`}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mint={selectedMint}
        onSuccess={handleSuccess}
        isSaving={updateMutation.isPending}
      />
    ) : null
  }

  return (
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
        href: "/admin/add-mint",
      }}
      emptyStateConfig={{
        title: "No Mints Yet",
        description: "Start by adding your first mint location.",
        showAddButton: true,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
