import { useEffect, useMemo, useRef, useState } from "react"

/**
 * One GeoJSON file the map may want. A layer is declared rather than
 * hardcoded, so adding a layer is a entry in a list rather than another
 * bespoke fetch and another piece of state.
 */
export type GeoJsonLayerSpec = {
  /** Stable name the caller looks the loaded data up by. */
  key: string
  /** Path under `/public`, e.g. `/data/provinces.geojson`. */
  path: string
  /**
   * Fetch only once this is true. Layers already fetched stay cached, so
   * toggling one off and on again costs nothing.
   */
  enabled?: boolean
}

type UseGeoJsonLayersResult = {
  /**
   * Declared key to its loaded collection, or null while it is still in
   * flight or the layer is disabled. Stable between renders, so callers can
   * depend on it in a memo.
   */
  layers: Record<string, GeoJSON.FeatureCollection | null>
  /** True while at least one enabled layer is still in flight. */
  loading: boolean
  /** The most recent load failure, if any. */
  error: string | null
}

/**
 * Loads the declared GeoJSON layers, lazily and at most once each.
 *
 * Caching is by path rather than by key, so two keys pointing at the same file
 * share a single fetch. Pass a memoised `specs` array: it is read through a
 * primitive derived from the enabled paths, so an unstable array identity
 * won't refetch, but it will churn the memo.
 */
export const useGeoJsonLayers = (
  specs: GeoJsonLayerSpec[],
): UseGeoJsonLayersResult => {
  const [data, setData] = useState<Record<string, GeoJSON.FeatureCollection>>(
    {},
  )
  const [error, setError] = useState<string | null>(null)
  // Paths already requested, successfully or not. A failed fetch stays here so
  // a broken file is not retried on every render.
  const attempted = useRef<Set<string>>(new Set())

  const enabledPaths = useMemo(
    () =>
      Array.from(
        new Set(
          specs.filter((s) => s.enabled !== false).map((spec) => spec.path),
        ),
      ).sort(),
    [specs],
  )
  // A primitive so the effect doesn't rerun on array identity alone.
  const enabledKey = enabledPaths.join("|")

  useEffect(() => {
    const paths = enabledKey ? enabledKey.split("|") : []

    for (const path of paths) {
      if (attempted.current.has(path)) continue
      attempted.current.add(path)

      void (async () => {
        try {
          const response = await fetch(path)
          if (!response.ok) {
            throw new Error(`${path}: ${response.statusText}`)
          }
          const collection =
            (await response.json()) as GeoJSON.FeatureCollection
          setData((prev) => ({ ...prev, [path]: collection }))
        } catch (cause) {
          console.error("Error loading map layer:", cause)
          setError(
            cause instanceof Error ? cause.message : `Failed to load ${path}`,
          )
        }
      })()
    }
  }, [enabledKey])

  const layers = useMemo(() => {
    const lookup: Record<string, GeoJSON.FeatureCollection | null> = {}
    for (const spec of specs) {
      lookup[spec.key] =
        spec.enabled === false ? null : (data[spec.path] ?? null)
    }
    return lookup
  }, [specs, data])

  const loading = enabledPaths.some((path) => !data[path])

  return { layers, loading, error }
}
