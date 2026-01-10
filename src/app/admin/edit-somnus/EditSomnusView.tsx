"use client"

import { useState } from "react"
import { useMints } from "~/api/mints"
import {
  useAddSomnusCoin,
  useAllSomnusCoins,
  useUpdateSomnusCoin,
} from "~/api/somnus-collection"
import { GenericEditView } from "~/components/admin/GenericEditView"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import { useDeityOptions } from "~/hooks/useDeityOptions"
import { useEditModal } from "~/hooks/useEditModal"
import type { CoinFormData } from "~/lib/validations/coin-form"
import { EditCoinModal } from "./EditCoinModal"

export function EditSomnusView() {
  const dataQuery = useAllSomnusCoins()
  const updateMutation = useUpdateSomnusCoin()
  const addMutation = useAddSomnusCoin()
  const { options: deityOptions } = useDeityOptions()
  const { data: mints } = useMints()

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
  } = useEditModal<SomnusCollection>()

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

  // Filter items based on nickname
  const filterFunction = (item: SomnusCollection, filterTerm: string) => {
    if (!filterTerm.trim()) return true

    const searchTerm = filterTerm.toLowerCase()

    // Check nickname
    const nicknameMatch =
      item.nickname?.toLowerCase().includes(searchTerm) ?? false

    return nicknameMatch
  }

  const renderListItem = (item: SomnusCollection) => {
    // Get deity names from IDs
    const deityNames =
      item.deity_id
        ?.map((deityId) => {
          const deity = deityOptions.find((option) => option.value === deityId)
          return deity?.label
        })
        .filter(Boolean) ?? []

    // Get mint name from mint_id
    const mintName = item.mint_id
      ? mints?.find((mint) => mint.id === item.mint_id)?.name
      : null

    // Create subtitle parts array, filtering out empty/null values
    const subtitleParts = [
      item.denomination,
      mintName,
      item.mint_year_earliest,
      deityNames.length > 0 ? deityNames.join(", ") : null,
    ].filter(Boolean)

    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-white">
            {item.nickname || "Unnamed Coin"}
          </h3>
          {subtitleParts.length > 0 && (
            <p className="text-sm text-gray-400">{subtitleParts.join(" • ")}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(!item.reference || item.reference.trim() === "") && (
            <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
              needs reference
            </span>
          )}
          {(!item.image_link_o || item.image_link_o.trim() === "") && (
            <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
              needs any photo
            </span>
          )}
          {item.image_link_o &&
            item.image_link_o.trim() !== "" &&
            !item.image_link_o.includes("src-timmday") && (
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">
                needs tim photo
              </span>
            )}
          {item.is_hidden && (
            <span
              className="text-lg"
              title="This coin is hidden from public view"
            >
              🕵️
            </span>
          )}
        </div>
      </div>
    )
  }

  const handleModalSave = async (id: number, coinFormData: CoinFormData) => {
    // Convert CoinFormData to Partial<SomnusCollection> for update
    try {
      await updateMutation.mutateAsync({
        id: id,
        data: coinFormData as Partial<SomnusCollection>,
      })
      handleSuccess("✅ Item updated successfully")
    } catch (error) {
      console.error("Error saving:", error)
      handleSuccess("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  const handleCreateSave = async (data: CoinFormData) => {
    try {
      await addMutation.mutateAsync(data)
      handleCreateSuccess("✅ Coin added successfully")
      // Modal handles its own closing and form reset
    } catch (error) {
      console.error("Error adding coin:", error)
      // Don't close modal or show success message - let modal handle error display
      throw error // Re-throw so modal can handle it
    }
  }

  const renderModal = (selectedCoin: SomnusCollection | null) => {
    return (
      <>
        {/* Edit Modal */}
        {selectedCoin && (
          <EditCoinModal
            key={`somnus-coin-${selectedCoin.id}-${selectedCoin.created_at}`}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            coin={selectedCoin}
            onSave={handleModalSave}
            isSaving={updateMutation.isPending}
            mode="edit"
          />
        )}
      </>
    )
  }

  return (
    <>
      <GenericEditView
        dataQuery={dataQuery}
        cardClass="artemis-card"
        itemColorScheme="slate"
        filterLabel="Filter by Nickname"
        filterPlaceholder="Search by nickname..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Coin",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Items Found",
          description: "Your Somnus collection is empty.",
          showAddButton: true,
        }}
        message={createMessage || message}
        onSuccess={handleSuccess}
      />

      {/* Create Modal */}
      <EditCoinModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        coin={null}
        onSave={async (id, coinFormData) => {
          await handleCreateSave(coinFormData)
        }}
        isSaving={addMutation.isPending}
        mode="create"
      />
    </>
  )
}
