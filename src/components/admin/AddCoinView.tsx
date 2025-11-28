"use client"

import { useEffect, useState } from "react"
import { useAddSomnusCoin } from "~/api/somnus-collection"
import { CoinForm } from "~/components/forms/CoinForm"
import { useAuth } from "~/components/providers/auth-provider"
import type { CoinFormData } from "~/lib/validations/coin-form"

export function AddCoinView() {
  const { user } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const addCoinMutation = useAddSomnusCoin()

  // Auto-clear success message
  useEffect(() => {
    if (message?.includes("🌙 Somnus accepts your offering")) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message])

  const handleFormSubmit = async (data: CoinFormData) => {
    if (!user) {
      setMessage("❌ Please log in to add coins to your collection")
      return
    }

    setMessage(null)

    try {
      await addCoinMutation.mutateAsync(data)
      setMessage("🌙 Somnus accepts your offering")
    } catch (error) {
      setMessage("❌ Failed to add coin to collection")
      console.error("Error:", error)
      throw error // Rethrow so form doesn't clear
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CoinForm
        onSubmit={handleFormSubmit}
        isLoading={addCoinMutation.isPending}
      />

      {message && (
        <div className="artemis-card mt-8 p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}
