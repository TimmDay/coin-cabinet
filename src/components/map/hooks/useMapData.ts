import { useEffect, useMemo, useState } from "react"

/**
 * One GeoJSON file the map may want. A layer is declared rather than
 * hardcoded, so adding a layer is an entry in a list rather than another
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

// Module scope, not per hook instance: the year slider's corpus is wanted by
// both the map and the controls beside it, and these files run to megabytes.
// Caching per component would fetch each one once per consumer.
const cache = new Map<string, GeoJSON.FeatureCollection>()
const inFlight = new Map<string, Promise<void>>()
const failed = new Map<string, string>()
const subscribers = new Set<() => void>()

function notify() {
  for (const callback of subscribers) callback()
}

function load(path: string): Promise<void> {
  const existing = inFlight.get(path)
  if (existing) return existing

  const request = (async () => {
    try {
      const response = await fetch(path)
      if (!response.ok) throw new Error(`${path}: ${response.statusText}`)
      cache.set(path, (await response.json()) as GeoJSON.FeatureCollection)
    } catch (cause) {
      console.error("Error loading map layer:", cause)
      failed.set(
        path,
        cause instanceof Error ? cause.message : `Failed to load ${path}`,
      )
    } finally {
      notify()
    }
  })()

  inFlight.set(path, request)
  return request
}

/**
 * Loads the declared GeoJSON layers, lazily and at most once each across the
 * whole page. A failed fetch is remembered, so a broken file is not retried
 * on every render.
 */
export const useGeoJsonLayers = (
  specs: GeoJsonLayerSpec[],
): UseGeoJsonLayersResult => {
  const [, setVersion] = useState(0)

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
    const rerender = () => setVersion((v) => v + 1)
    subscribers.add(rerender)

    for (const path of enabledKey ? enabledKey.split("|") : []) {
      if (cache.has(path) || failed.has(path)) continue
      void load(path)
    }

    return () => {
      subscribers.delete(rerender)
    }
  }, [enabledKey])

  const layers = useMemo(() => {
    const lookup: Record<string, GeoJSON.FeatureCollection | null> = {}
    for (const spec of specs) {
      lookup[spec.key] =
        spec.enabled === false ? null : (cache.get(spec.path) ?? null)
    }
    return lookup
    // `cache` is mutable module state; the subscription above drives rerenders,
    // and enabledKey changing is what can alter which paths are read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specs, enabledKey, cache.size])

  const loading = enabledPaths.some(
    (path) => !cache.has(path) && !failed.has(path),
  )
  const error = enabledPaths.map((path) => failed.get(path)).find(Boolean)

  return { layers, loading, error: error ?? null }
}
