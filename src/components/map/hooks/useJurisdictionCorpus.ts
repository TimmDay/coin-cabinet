import { useEffect, useMemo, useState } from "react"
import type { Corpus, JurisdictionFeature, Source } from "../jurisdictions"
import { useGeoJsonLayers, type GeoJsonLayerSpec } from "./useMapData"

const REALMS = "/data/jurisdictions/realms.geojson"
const PROVINCES = "/data/jurisdictions/provinces.geojson"
const SOURCES = "/data/jurisdictions/sources.json"

// The Source records are a plain object rather than a FeatureCollection, so
// they don't go through the layer hook. Cached at module scope for the same
// reason the layers are: several components want the corpus at once.
let sourcesCache: Record<string, Source> | null = null
let sourcesRequest: Promise<void> | null = null

/**
 * Loads the Jurisdiction corpus the year slider resolves against: geometry
 * plus the Source records that decide what counts as Attested.
 */
export const useJurisdictionCorpus = (enabled = true): Corpus | null => {
  const [sources, setSources] = useState<Record<string, Source> | null>(
    sourcesCache,
  )

  const specs = useMemo<GeoJsonLayerSpec[]>(
    () => [
      { key: "realms", path: REALMS, enabled },
      { key: "provinces", path: PROVINCES, enabled },
    ],
    [enabled],
  )
  const { layers } = useGeoJsonLayers(specs)

  useEffect(() => {
    if (!enabled || sources) return
    let live = true

    sourcesRequest ??= (async () => {
      try {
        const response = await fetch(SOURCES)
        if (!response.ok) throw new Error(response.statusText)
        sourcesCache = (await response.json()) as Record<string, Source>
      } catch (cause) {
        console.error("Error loading Jurisdiction sources:", cause)
        // An empty record is the honest fallback: with no Source to vouch for
        // it, the resolver reports everything as Inferred rather than
        // presenting unattributed geometry as fact.
        sourcesCache = {}
      }
    })()

    void sourcesRequest.then(() => {
      if (live) setSources(sourcesCache)
    })

    return () => {
      live = false
    }
  }, [enabled, sources])

  // One corpus across every Tier: the resolver narrows by Tier itself, and a
  // Tier control has to know which Tiers hold anything at the Selected year,
  // which it cannot do from a partially loaded corpus.
  const { realms, provinces } = layers

  return useMemo(() => {
    if (!realms || !provinces || !sources) return null
    return {
      features: [
        ...(realms.features as JurisdictionFeature[]),
        ...(provinces.features as JurisdictionFeature[]),
      ],
      sources,
    }
  }, [realms, provinces, sources])
}
