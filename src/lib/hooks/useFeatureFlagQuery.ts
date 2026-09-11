import { useCallback, useEffect, useState } from "react"

/**
 * Returns a function that appends the current `?feat=` query param (if any)
 * onto an internal href, so an active feature flag stays visible in the URL
 * bar as you navigate around the site instead of disappearing after the
 * first click. Reads window.location directly (like useFeatureFlag) rather
 * than next/navigation's useSearchParams, so nav components using this
 * don't force every page in the root layout out of static rendering.
 */
export function useFeatureFlagQuery() {
  const [feat, setFeat] = useState<string | null>(null)

  useEffect(() => {
    try {
      setFeat(new URLSearchParams(window.location.search).get("feat"))
    } catch {
      setFeat(null)
    }
  }, [])

  return useCallback(
    (href: string) => (feat ? `${href}?feat=${feat}` : href),
    [feat],
  )
}
