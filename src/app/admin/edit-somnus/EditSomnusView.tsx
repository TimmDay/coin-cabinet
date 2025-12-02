"use client"

import { useAllSomnusCoins, useUpdateSomnusCoin } from "~/api/somnus-collection"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditCoinModal } from "./EditCoinModal"

export function EditSomnusView() {
  const dataQuery = useAllSomnusCoins()
  const updateMutation = useUpdateSomnusCoin()

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<SomnusCollection>()

  // Filter items based on nickname and devices
  const filterFunction = (item: SomnusCollection, filterTerm: string) => {
    if (!filterTerm.trim()) return true

    const searchTerm = filterTerm.toLowerCase()

    // Check nickname
    const nicknameMatch =
      item.nickname?.toLowerCase().includes(searchTerm) ?? false

    // Check devices array
    const devicesMatch =
      item.devices?.some((device: string) =>
        device.toLowerCase().includes(searchTerm),
      ) ?? false

    return nicknameMatch || devicesMatch
  }

  const renderListItem = (item: SomnusCollection) => (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
        <h3 className="font-medium text-white">
          {item.nickname || "Unnamed Coin"}
        </h3>
        {item.devices && item.devices.length > 0 && (
          <p className="text-sm text-gray-400">
            {`${item.denomination} • ${item.mint} • ${item.mint_year_earliest}`}
          </p>
        )}
      </div>
      {(!item.reference || item.reference.trim() === "") && (
        <span className="mr-3 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
          needs reference
        </span>
      )}
    </div>
  )

  const handleModalSave = async (
    id: number,
    updates: Partial<SomnusCollection>,
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: id,
        data: updates,
      })
      handleSuccess("✅ Item updated successfully")
    } catch (error) {
      console.error("Error saving:", error)
      handleSuccess("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  const renderModal = (selectedCoin: SomnusCollection | null) => {
    return (
      <EditCoinModal
        key={
          selectedCoin
            ? `somnus-coin-${selectedCoin.id}-${selectedCoin.created_at}`
            : "no-coin"
        }
        isOpen={isModalOpen}
        onClose={handleModalClose}
        coin={selectedCoin}
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
      filterLabel="Filter by Nickname or Devices"
      filterPlaceholder="Search by nickname or device (e.g., victoria, mars)..."
      filterFunction={filterFunction}
      renderListItem={renderListItem}
      selectedItemId={selectedItemId}
      onItemSelect={handleItemSelect}
      renderModal={renderModal}
      addNewConfig={{
        label: "Add New Coin",
        href: "/admin/add-coin",
      }}
      emptyStateConfig={{
        title: "No Items Found",
        description: "Your Somnus collection is empty.",
        showAddButton: true,
      }}
      message={message}
      onSuccess={handleSuccess}
    />
  )
}
