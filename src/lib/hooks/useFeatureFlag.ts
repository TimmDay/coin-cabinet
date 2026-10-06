import { useEffect, useSyncExternalStore } from "react"
import { type FeatureFlagName } from "../feature-flags"

const FEATURE_FLAG_STORAGE_KEY = "feat-flags"

/** `?feat=off` turns everything back off. Not a flag name. */
export const OFF_PARAM = "off"

// Flags live in localStorage, which React cannot see. Rather than copy them
// into state inside an effect, they are exposed as an external store: the
// component reads the live value during render and re-reads when it changes.
// That keeps the one source of truth in localStorage instead of mirroring it.
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  // Another tab setting a flag should reach this one too.
  window.addEventListener("storage", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
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

/** The `feat` query parameter, or null. Reads `window` directly. */
function urlFlagParam(): string | null {
  if (typeof window === "undefined") return null
  try {
    return new URLSearchParams(window.location.search).get("feat")
  } catch {
    return null
  }
}

/**
 * Applies whatever `?feat=` asks for: enabling a flag, or clearing them all.
 *
 * This is a genuine side effect on storage, so it stays in an effect. The
 * value a component renders comes from the store rather than from here.
 */
function applyUrlParam(): void {
  const param = urlFlagParam()
  if (!param) return

  try {
    if (param === OFF_PARAM) {
      localStorage.removeItem(FEATURE_FLAG_STORAGE_KEY)
    } else {
      const stored = getStoredFeatureFlags()
      if (stored[param] === true) return
      stored[param] = true
      localStorage.setItem(FEATURE_FLAG_STORAGE_KEY, JSON.stringify(stored))
    }
  } catch {
    // A browser refusing storage keeps whatever it had, which is nothing.
    return
  }
  emit()
}

/**
 * Whether a feature flag is on, from the URL or from a previous visit.
 *
 * `?feat=<name>` turns one on and remembers it; `?feat=off` clears them all.
 * The server always renders flags as off, since it cannot know, so anything
 * behind one appears after hydration.
 */
export function useFeatureFlag(flagName: FeatureFlagName) {
  const isEnabled = useSyncExternalStore(
    subscribe,
    () => getStoredFeatureFlags()[flagName] === true,
    () => false,
  )

  useEffect(() => {
    applyUrlParam()
  }, [])

  return isEnabled
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
  emit()
}

/**
 * Clear all feature flags
 */
export function clearFeatureFlags() {
  if (typeof window === "undefined") return
  localStorage.removeItem(FEATURE_FLAG_STORAGE_KEY)
  emit()
}

/**
 * Convenience hook for checking feature flags with TypeScript autocomplete
 * Usage: const showArticles = useTypedFeatureFlag('articles')
 */
export function useTypedFeatureFlag(flagName: FeatureFlagName) {
  return useFeatureFlag(flagName)
}
