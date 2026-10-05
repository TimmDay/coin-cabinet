// Resolves what the map draws at a Selected year. See CONTEXT.md for the
// vocabulary: Jurisdiction, Tier, Span, Selected year, Change year, Attested,
// Inferred, Coverage, Basis year.
//
// Everything here is pure. Loading lives in the map's layer hook, rendering in
// Map.tsx, so the whole behaviour of the year slider is testable without a map.

export type Tier = "realm" | "province" | "city"

export const TIERS: Tier[] = ["realm", "province", "city"]

/** The slider's window. Nothing outside it is reachable. */
export const SLIDER_START = -200
export const SLIDER_END = 1453

export type JurisdictionProperties = {
  slug: string
  name: string
  altNames?: string[]
  tier: Tier
  kind: string
  /** Where the geometry came from. */
  source: string
  /** Where the Span came from, when that differs from the geometry's source. */
  spanSource?: string
  /** The year this geometry depicts, often not the Selected year. */
  basisYear: number
  segmentStart: number
  segmentEnd: number
  spanStart: number
  spanEnd: number
}

export type JurisdictionFeature = GeoJSON.Feature<
  GeoJSON.Geometry,
  JurisdictionProperties
>

export type Source = {
  title: string
  url?: string
  licence?: string
  licenceUrl?: string
  /** The years this Source actually speaks to. */
  coverage: { from: number; to: number }
  modified?: string
  defects?: string[]
}

export type Corpus = {
  features: JurisdictionFeature[]
  sources: Record<string, Source>
}

export type ResolvedJurisdiction = {
  slug: string
  name: string
  tier: Tier
  basisYear: number
  /** False when any Source it relies on does not cover the Selected year. */
  attested: boolean
  feature: JurisdictionFeature
}

export type Provenance = {
  /** Source keys backing what is currently drawn, in a stable order. */
  sourceKeys: string[]
  /** Titles of those Sources, for display. */
  sourceTitles: string[]
  anyInferred: boolean
  /** A plain sentence naming the Sources and admitting to any guesswork. */
  sentence: string
}

export type Resolution = {
  jurisdictions: ResolvedJurisdiction[]
  provenance: Provenance
  /** Tiers holding at least one Jurisdiction at the Selected year. */
  availableTiers: Tier[]
}

/** Every Source a feature leans on: its geometry's, and its Span's. */
function sourceKeysFor(properties: JurisdictionProperties): string[] {
  const keys = [properties.source]
  if (properties.spanSource && properties.spanSource !== properties.source) {
    keys.push(properties.spanSource)
  }
  return keys
}

function covers(source: Source | undefined, year: number): boolean {
  // An undeclared Source cannot vouch for anything, so treat it as not
  // covering rather than silently attesting.
  if (!source) return false
  return year >= source.coverage.from && year <= source.coverage.to
}

/**
 * The segment of each Jurisdiction that contains the Selected year.
 *
 * Containment rather than "most recent segment" is deliberate. Several
 * Jurisdictions have gaps in the upstream data (the eastern empire has none
 * for 1227-1278, which is exactly when Nicaea and Epirus held the territory).
 * Carrying the last known shape forward across a gap would draw an empire
 * where a successor state actually was.
 */
function segmentsAt(
  features: JurisdictionFeature[],
  year: number,
): JurisdictionFeature[] {
  const bySlug = new Map<string, JurisdictionFeature>()

  for (const feature of features) {
    const p = feature.properties
    if (year < p.segmentStart || year > p.segmentEnd) continue

    // Overlapping segments for one Jurisdiction shouldn't happen, but if the
    // upstream data has them, prefer the one that starts later: it is the more
    // specific statement about this year.
    const held = bySlug.get(p.slug)
    if (!held || p.segmentStart > held.properties.segmentStart) {
      bySlug.set(p.slug, feature)
    }
  }

  return [...bySlug.values()]
}

function buildSentence(
  titles: string[],
  inferredNames: string[],
  year: number,
): string {
  if (titles.length === 0) {
    return `Nothing mapped for ${formatYear(year)}.`
  }

  const attribution = `Boundaries after ${joinList(titles)}.`
  if (inferredNames.length === 0) return attribution

  return `${attribution} Reconstructed for this year, not attested: ${joinList(
    inferredNames,
  )}.`
}

/** "a", "a and b", "a, b and c" */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ""
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
}

/** 200 BC / AD 1453, with no year zero implied. */
export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `AD ${year}`
}

/**
 * What the map should draw at `year`, optionally narrowed to one Tier.
 */
export function resolveAtYear(
  corpus: Corpus,
  year: number,
  tier?: Tier,
): Resolution {
  const present = segmentsAt(corpus.features, year)

  const availableTiers = TIERS.filter((candidate) =>
    present.some((f) => f.properties.tier === candidate),
  )

  const inTier = tier
    ? present.filter((f) => f.properties.tier === tier)
    : present

  const jurisdictions: ResolvedJurisdiction[] = inTier
    .map((feature) => {
      const p = feature.properties
      return {
        slug: p.slug,
        name: p.name,
        tier: p.tier,
        basisYear: p.basisYear,
        attested: sourceKeysFor(p).every((key) =>
          covers(corpus.sources[key], year),
        ),
        feature,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const sourceKeys = [
    ...new Set(inTier.flatMap((f) => sourceKeysFor(f.properties))),
  ].sort()

  const provenance: Provenance = {
    sourceKeys,
    sourceTitles: sourceKeys.map((key) => corpus.sources[key]?.title ?? key),
    anyInferred: jurisdictions.some((j) => !j.attested),
    sentence: buildSentence(
      sourceKeys.map((key) => corpus.sources[key]?.title ?? key),
      jurisdictions.filter((j) => !j.attested).map((j) => j.name),
      year,
    ),
  }

  return { jurisdictions, provenance, availableTiers }
}

/**
 * Years in which the drawn set changes: a segment begins, or the year after
 * one ends. These become the slider's ticks, so a visitor can see that long
 * stretches genuinely held steady rather than assuming the control is stuck.
 */
export function changeYears(corpus: Corpus, tier?: Tier): number[] {
  const years = new Set<number>()

  for (const feature of corpus.features) {
    const p = feature.properties
    if (tier && p.tier !== tier) continue

    if (p.segmentStart > SLIDER_START) years.add(p.segmentStart)
    // The change lands the year after a segment's last year.
    if (p.segmentEnd < SLIDER_END) years.add(p.segmentEnd + 1)
  }

  return [...years].sort((a, b) => a - b)
}

/** [west, south, east, north] covering every drawn Jurisdiction, or null. */
export function boundsOf(
  jurisdictions: ResolvedJurisdiction[],
): [number, number, number, number] | null {
  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity

  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number]
      west = Math.min(west, lng)
      east = Math.max(east, lng)
      south = Math.min(south, lat)
      north = Math.max(north, lat)
      return
    }
    for (const child of coords) visit(child)
  }

  for (const { feature } of jurisdictions) {
    if (feature.geometry && "coordinates" in feature.geometry) {
      visit(feature.geometry.coordinates)
    }
  }

  return west === Infinity ? null : [west, south, east, north]
}
