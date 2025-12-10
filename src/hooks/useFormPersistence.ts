import { useEffect, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"

type UseFormPersistenceOptions<T = Record<string, unknown>> = {
  key: string
  form: UseFormReturn<T>
  enabled?: boolean
}

export function useFormPersistence<T = Record<string, unknown>>({
  key,
  form,
  enabled = true,
}: UseFormPersistenceOptions<T>) {
  const formValues = form.watch()
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Save form data to localStorage with debouncing
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to save after 1 second of inactivity
    timeoutRef.current = setTimeout(() => {
      try {
        const dataToSave = {
          values: formValues,
          timestamp: Date.now(),
        }
        localStorage.setItem(`form_${key}`, JSON.stringify(dataToSave))
      } catch (error) {
        console.warn("Failed to save form data to localStorage:", error)
      }
    }, 1000)

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formValues, key, enabled])

  // Restore form data from localStorage on mount
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    try {
      const savedData = localStorage.getItem(`form_${key}`)
      if (savedData) {
        const parsed = JSON.parse(savedData) as {
          values?: T
          timestamp?: number
        }
        // Only restore if saved within the last 24 hours
        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 &&
          parsed.values
        ) {
          // Reset form with saved values
          form.reset(parsed.values)
        } else {
          // Clean up expired data
          localStorage.removeItem(`form_${key}`)
        }
      }
    } catch (error) {
      console.warn("Failed to restore form data from localStorage:", error)
      // Clean up corrupted data
      localStorage.removeItem(`form_${key}`)
    }
  }, [key, enabled, form])

  // Clear saved data
  const clearSavedData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`form_${key}`)
    }
  }

  return { clearSavedData }
}
