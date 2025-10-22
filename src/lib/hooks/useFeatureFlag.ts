import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { type FeatureFlagName } from "../feature-flags"

const FEATURE_FLAG_STORAGE_KEY = "feat-flags"

/**
 * Hook to check for feature flags with localStorage persistence
 * Checks URL first, then localStorage, and persists URL flags to localStorage
 * @param flagName - The name of the feature flag to check
 * @returns boolean indicating if the feature flag is enabled
 */
export function useFeatureFlag(flagName: FeatureFlagName) {
  const searchParams = useSearchParams()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const urlFeatParam = searchParams.get("feat")

    // Check URL first - if found, enable and persist to localStorage
    if (urlFeatParam === flagName) {
      setIsEnabled(true)
      // Persist to localStorage for future sessions
      const storedFlags = getStoredFeatureFlags()
      storedFlags[flagName] = true
      localStorage.setItem(
        FEATURE_FLAG_STORAGE_KEY,
        JSON.stringify(storedFlags),
      )
      return
    }

    // Check localStorage for previously enabled flags
    const storedFlags = getStoredFeatureFlags()
    setIsEnabled(storedFlags[flagName] === true)
  }, [searchParams, flagName])

  return isEnabled
}

/**
 * Get stored feature flags from localStorage
 */
function getStoredFeatureFlags(): Record<string, boolean> {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(FEATURE_FLAG_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

/**
 * Manually enable/disable a feature flag
 * @param flagName - The name of the feature flag
 * @param enabled - Whether to enable or disable the flag
 */
export function setFeatureFlag(flagName: FeatureFlagName, enabled: boolean) {
  if (typeof window === "undefined") return

  const storedFlags = getStoredFeatureFlags()
  if (enabled) {
    storedFlags[flagName] = true
  } else {
    delete storedFlags[flagName]
  }
  localStorage.setItem(FEATURE_FLAG_STORAGE_KEY, JSON.stringify(storedFlags))
}

/**
 * Clear all feature flags
 */
export function clearFeatureFlags() {
  if (typeof window === "undefined") return
  localStorage.removeItem(FEATURE_FLAG_STORAGE_KEY)
}

/**
 * Convenience hook for checking feature flags with TypeScript autocomplete
 * Usage: const isDevMode = useTypedFeatureFlag('dev')
 * Usage: const isMapEnabled = useTypedFeatureFlag('map-feature')
 */
export function useTypedFeatureFlag(flagName: FeatureFlagName) {
  return useFeatureFlag(flagName)
}

/**
 * @deprecated Use useTypedFeatureFlag instead for better type safety
 * Convenience hook specifically for checking the 'dev' feature flag
 * Usage: const isDevMode = useDevFeatureFlag()
 */
export function useDevFeatureFlag() {
  return useFeatureFlag("dev")
}
