import { useState } from "react"

export function useEditModal<T extends { id: number | string }>() {
  const [message, setMessage] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleItemSelect = (item: T) => {
    setSelectedItemId(item.id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedItemId(null)
  }

  const handleSuccess = (successMessage: string) => {
    setMessage(successMessage)
    setTimeout(() => setMessage(null), 3000)
  }

  return {
    // State
    message,
    selectedItemId,
    isModalOpen,

    // Handlers
    handleItemSelect,
    handleModalClose,
    handleSuccess,

    // Direct setters (for advanced usage)
    setMessage,
    setSelectedItemId,
    setIsModalOpen,
  }
}
