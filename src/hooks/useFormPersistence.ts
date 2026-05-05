import { useEffect, useRef } from "react"
import type { UseFormReturn, FieldValues } from "react-hook-form"

type UseFormPersistenceOptions<T extends FieldValues = FieldValues> = {
  key: string
  form: UseFormReturn<T>
  enabled?: boolean
  // Fields listed here are never restored from localStorage — they always
  // come from the database via the form's `values` prop. This prevents a
  // stale snapshot from overwriting correct DB state for relational fields.
  excludeFromRestore?: string[]
}

export function useFormPersistence<T extends FieldValues = FieldValues>({
  key,
  form,
  enabled = true,
  excludeFromRestore = [],
}: UseFormPersistenceOptions<T>) {
  const formValues = form.watch()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const excludeFromRestoreRef = useRef(excludeFromRestore)

  // Save form data to localStorage with debouncing
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

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
          values?: Record<string, unknown>
          timestamp?: number
        }
        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 &&
          parsed.values
        ) {
          const excluded = excludeFromRestoreRef.current
          const valuesToRestore =
            excluded.length > 0
              ? Object.fromEntries(
                  Object.entries(parsed.values).filter(
                    ([k]) => !excluded.includes(k),
                  ),
                )
              : parsed.values

          form.reset({ ...form.getValues(), ...valuesToRestore })
        } else {
          localStorage.removeItem(`form_${key}`)
        }
      }
    } catch (error) {
      console.warn("Failed to restore form data from localStorage:", error)
      localStorage.removeItem(`form_${key}`)
    }
  }, [key, enabled, form])

  const clearSavedData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`form_${key}`)
    }
  }

  return { clearSavedData }
}
