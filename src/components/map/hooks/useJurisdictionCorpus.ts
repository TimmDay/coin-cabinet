import { useQuery } from "@tanstack/react-query"
import type { Corpus, JurisdictionFeature, Source } from "../jurisdictions"

const REALMS = "/data/jurisdictions/realms.geojson"
const PROVINCES = "/data/jurisdictions/provinces.geojson"
const SOURCES = "/data/jurisdictions/sources.json"

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`${path}: ${response.statusText}`)
  return (await response.json()) as T
}

/**
 * The Jurisdiction corpus the year slider resolves against: geometry from
 * every Tier, plus the Source records that decide what counts as Attested.
 * Fails if the geometry does; Sources that fail fall back to none.
 */
export async function fetchJurisdictionCorpus(): Promise<Corpus> {
  const [realms, provinces, sources] = await Promise.all([
    fetchJson<GeoJSON.FeatureCollection>(REALMS),
    fetchJson<GeoJSON.FeatureCollection>(PROVINCES),
    fetchJson<Record<string, Source>>(SOURCES).catch((cause: unknown) => {
      console.error("Error loading Jurisdiction sources:", cause)
      // An empty record is the honest fallback: with no Source to vouch for
      // it, the resolver reports everything as Inferred rather than
      // presenting unattributed geometry as fact.
      return {}
    }),
  ])

  // One corpus across every Tier: the resolver narrows by Tier itself, and a
  // Tier control has to know which Tiers hold anything at the Selected year,
  // which it cannot do from a partially loaded corpus.
  return {
    features: [
      ...(realms.features as JurisdictionFeature[]),
      ...(provinces.features as JurisdictionFeature[]),
    ],
    sources,
  }
}

/**
 * The Jurisdiction corpus, or null while it loads (or when not `enabled`).
 * Fetched once for the page and shared by every caller: the map and the
 * controls beside it both want it, and the files run to megabytes.
 */
export const useJurisdictionCorpus = (enabled = true): Corpus | null => {
  const { data } = useQuery({
    queryKey: ["jurisdiction-corpus"],
    queryFn: fetchJurisdictionCorpus,
    enabled,
    // Static files that change only with a deploy
    staleTime: Infinity,
  })
  return data ?? null
}
