"use client"

import { useEffect, useState } from "react"
import { useAddDeity } from "~/api/deities"
import { DeityForm } from "~/components/forms/DeityForm"
import { useAuth } from "~/components/providers/auth-provider"
import type { DeityFormData } from "~/lib/validations/deity-form"

export function AddDeityView() {
  const { user } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const addDeityMutation = useAddDeity()

  // Auto-clear success message
  useEffect(() => {
    if (message?.includes("✨ Deity added successfully")) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message])

  const handleFormSubmit = async (data: DeityFormData) => {
    if (!user) {
      setMessage("❌ Please log in to add deities")
      return
    }

    setMessage(null)

    try {
      await addDeityMutation.mutateAsync(data)
      setMessage("✨ Deity added successfully to the pantheon")
    } catch (error) {
      setMessage("❌ Failed to add deity")
      console.error("Error:", error)
      throw error // Rethrow so form doesn't clear
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <DeityForm
        onSubmit={handleFormSubmit}
        isLoading={addDeityMutation.isPending}
      />

      {message && (
        <div className="artemis-card mt-8 p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
