"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useAuth } from "~/components/providers/auth-provider"

type AddFormWrapperProps<TFormData> = {
  children: (props: {
    onSubmit: (data: TFormData) => Promise<void>
    isLoading: boolean
  }) => ReactNode
  mutation: {
    mutateAsync: (data: TFormData) => Promise<unknown>
    isPending: boolean
  }
  successMessage?: string
  errorMessage?: string
  loginRequiredMessage?: string
  autoRedirect?: {
    enabled: boolean
    delay?: number
    path?: string
    router?: {
      push: (path: string) => void
    }
  }
}

/**
 * Shared wrapper component for add forms that handles common patterns:
 * - User authentication check
 * - Success/error message state
 * - Auto-clearing success messages  
 * - Optional redirect after success
 * - Consistent error handling
 */
export function AddFormWrapper<TFormData>({
  children,
  mutation,
  successMessage = "✅ Added successfully",
  errorMessage = "❌ Failed to add",
  loginRequiredMessage = "❌ Please log in to continue",
  autoRedirect,
}: AddFormWrapperProps<TFormData>) {
  const { user } = useAuth()
  const [message, setMessage] = useState<string | null>(null)

  // Auto-clear success message
  useEffect(() => {
    if (message?.startsWith("✅") || message?.includes("🌙") || message?.includes("✨")) {
      const timer = setTimeout(() => {
        setMessage(null)
        
        // Handle auto-redirect
        if (autoRedirect?.enabled && autoRedirect.router && autoRedirect.path) {
          autoRedirect.router.push(autoRedirect.path)
        }
      }, autoRedirect?.delay ?? 3000)

      return () => clearTimeout(timer)
    }
  }, [message, autoRedirect])

  const handleFormSubmit = async (data: TFormData) => {
    if (!user) {
      setMessage(loginRequiredMessage)
      return
    }

    setMessage(null)

    try {
      await mutation.mutateAsync(data)
      setMessage(successMessage)
    } catch (error) {
      setMessage(errorMessage)
      console.error("Error:", error)
      throw error // Rethrow so form doesn't clear
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Render the form component, injecting our handleFormSubmit */}
      {children({ onSubmit: handleFormSubmit, isLoading: mutation.isPending })}

      {message && (
        <div className="artemis-card mt-8 p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}