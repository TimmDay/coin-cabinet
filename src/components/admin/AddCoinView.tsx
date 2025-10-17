"use client"

import { useEffect, useState } from "react"
import { CoinForm } from "~/components/forms/CoinForm"
import { useAuth } from "~/components/providers/auth-provider"
import type { CoinFormData } from "~/lib/validations/coin-form"

type ApiResponse = {
  success: boolean
  message?: string
}

export function AddCoinView() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/somnus-collection/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      const result = (await response.json()) as ApiResponse

      if (result.success) {
        setMessage("🌙 Somnus accepts your offering")
      } else {
        setMessage(`❌ Error: ${result.message}`)
        throw new Error(result.message ?? "Submission failed")
      }
    } catch (error) {
      // Set error message but rethrow so form knows it failed
      if (!message?.includes("❌ Error:")) {
        setMessage("❌ Failed to add coin to collection")
      }
      console.error("Error:", error)
      throw error // Rethrow so form doesn't clear
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CoinForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {message && (
        <div className="artemis-card mt-8 p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}