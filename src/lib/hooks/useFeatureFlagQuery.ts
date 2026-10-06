import { useCallback, useSyncExternalStore } from "react"

/** Nothing pushes a new `?feat=` without a navigation, which remounts. */
const subscribe = () => () => {}

function readFeatParam(): string | null {
  try {
    return new URLSearchParams(window.location.search).get("feat")
  } catch {
    return null
  }
}

/**
 * Returns a function that appends the current `?feat=` query param (if any)
 * onto an internal href, so an active feature flag stays visible in the URL
 * bar as you navigate around the site instead of disappearing after the
 * first click. Reads window.location directly (like useFeatureFlag) rather
 * than next/navigation's useSearchParams, so nav components using this
 * don't force every page in the root layout out of static rendering.
 *
 * The parameter is read as an external store rather than copied into state
 * on mount: the server has no URL to read, so it reports null and the real
 * value arrives at hydration without a second render pass.
 */
export function useFeatureFlagQuery() {
  const feat = useSyncExternalStore(subscribe, readFeatParam, () => null)

  return useCallback(
    (href: string) => (feat ? `${href}?feat=${feat}` : href),
    [feat],
  )
}
