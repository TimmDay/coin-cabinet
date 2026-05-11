"use client"

import { useMemo, useState } from "react"
import { useDeleteDevice, useDevices, useUpdateDevice } from "~/api/devices"
import { useAllSomnusCoins } from "~/api/somnus-collection"
import { GenericEditView } from "~/components/admin/GenericEditView"
import type { Device } from "~/database/schema-devices"
import { useEditModal } from "~/hooks/useEditModal"
import { EditDeviceModal } from "./EditDeviceModal"

export function EditDevicesView() {
  const dataQuery = useDevices()
  const updateMutation = useUpdateDevice()
  const deleteMutation = useDeleteDevice()
  const { data: allCoins } = useAllSomnusCoins()

  const coinsByDeviceId = useMemo(() => {
    const map = new Map<string, { id: number; nickname: string }[]>()
    for (const coin of allCoins ?? []) {
      const allDeviceIds = [
        ...(coin.obv_device_ids ?? []),
        ...(coin.rev_device_ids ?? []),
      ]
      for (const deviceId of allDeviceIds) {
        const existing = map.get(deviceId) ?? []
        if (!existing.some((c) => c.id === coin.id)) {
          existing.push({ id: coin.id, nickname: coin.nickname })
        }
        map.set(deviceId, existing)
      }
    }
    return map
  }, [allCoins])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createMessage, setCreateMessage] = useState("")

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Device>()

  const handleCreateModalOpen = () => setIsCreateModalOpen(true)
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false)
    setCreateMessage("")
  }
  const handleCreateSuccess = (message: string) => {
    setCreateMessage(message)
    setTimeout(() => setCreateMessage(""), 3000)
  }

  const handleDelete = async (device: Device) => {
    if (!confirm(`Are you sure you want to delete "${device.name}"?`)) return
    try {
      await deleteMutation.mutateAsync(device.id)
      handleSuccess(`✅ ${device.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${device.name}`)
    }
  }

  const filterFunction = (device: Device, filterTerm: string) => {
    const term = filterTerm.toLowerCase()
    return (
      device.name.toLowerCase().includes(term) ||
      (device.category?.toLowerCase().includes(term) ?? false) ||
      device.description.toLowerCase().includes(term)
    )
  }

  const renderListItem = (device: Device) => {
    const linkedCoins = coinsByDeviceId.get(device.id) ?? []
    const visibleCoins = linkedCoins.slice(0, 3)
    const overflow = linkedCoins.length - visibleCoins.length

    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-white">
            {device.name}
            {device.translation && (
              <span className="ml-2 text-sm text-gray-300">
                ({device.translation})
              </span>
            )}
          </h3>
          <div className="mt-1 space-y-1">
            {device.category && (
              <p className="text-sm text-gray-400">{device.category}</p>
            )}
            <p className="line-clamp-1 text-xs text-gray-500">
              {device.description}
            </p>
            {linkedCoins.length > 0 ? (
              <p className="text-xs text-slate-400">
                {visibleCoins.map((c) => c.nickname).join(", ")}
                {overflow > 0 && (
                  <span className="text-slate-500"> +{overflow} more</span>
                )}
              </p>
            ) : (
              <p className="text-xs text-slate-600 italic">
                not linked to any coins
              </p>
            )}
          </div>
        </div>
        <div className="mr-3 flex flex-col items-end gap-1">
          {linkedCoins.length > 0 ? (
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
              {linkedCoins.length} {linkedCoins.length === 1 ? "coin" : "coins"}
            </span>
          ) : (
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
              unused
            </span>
          )}
          {device.sources.length === 0 && (
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
              needs sources
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            void handleDelete(device)
          }}
          className="mr-3 rounded p-1 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
          title={`Delete ${device.name}`}
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
  }

  const renderModal = (selectedDevice: Device | null) => (
    <>
      {selectedDevice && (
        <EditDeviceModal
          key={`device-${selectedDevice.id}-${selectedDevice.updated_at}`}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          device={selectedDevice}
          onSuccess={handleSuccess}
          isSaving={updateMutation.isPending}
          mode="edit"
        />
      )}
    </>
  )

  const CreateModal = () => (
    <EditDeviceModal
      isOpen={isCreateModalOpen}
      onClose={handleCreateModalClose}
      device={null}
      onSuccess={handleCreateSuccess}
      isSaving={false}
      mode="create"
    />
  )

  const displayMessage = createMessage || message

  return (
    <>
      <GenericEditView
        dataQuery={dataQuery}
        cardClass="artemis-card"
        itemColorScheme="slate"
        filterLabel="Filter by Name, Category, or Description"
        filterPlaceholder="Search devices..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Device",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Devices Yet",
          description: "Start by adding your first device.",
          showAddButton: true,
        }}
        message={displayMessage}
        onSuccess={handleSuccess}
      />
      <CreateModal />
    </>
  )
}
