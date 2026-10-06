// Resolves what the map draws at a Selected year. See CONTEXT.md for the
// vocabulary: Jurisdiction, Tier, Span, Selected year, Change year, Attested,
// Inferred, Coverage, Basis year.
//
// Everything here is pure. Loading lives in the map's layer hook, rendering in
// Map.tsx, so the whole behaviour of the year slider is testable without a map.

export type Tier = "realm" | "province" | "city"

/** A Jurisdiction's relationship to Rome. See CONTEXT.md. */
export type Role = "roman" | "client" | "adversary"

/** The Roles that are not Rome, in the order the toggle lists them. */
export const OUTSIDER_ROLES: Role[] = ["client", "adversary"]

export const TIERS: Tier[] = ["realm", "province", "city"]

/**
 * The Tier a coin's own map opens at.
 *
 * Realms rather than provinces: at a typical coin's year the Province Tier is
 * forty-odd outlines, each carrying a label, which buries the coin's own pins
 * under other people's borders. A Realm is one or two shapes and answers what
 * the page is actually asking, which is whose empire this was struck in.
 */
export const COIN_PAGE_TIER: Tier = "realm"

/** The slider's window. Nothing outside it is reachable. */
export const SLIDER_START = -400
export const SLIDER_END = 1453

export type JurisdictionProperties = {
  slug: string
  name: string
  altNames?: string[]
  tier: Tier
  kind: string
  /** Defaults to Roman for anything built before Role existed. */
  role?: Role
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
  /** Not a bibliographic Source: a marker that these dates are assumed. */
  placeholder?: boolean
}

export type Corpus = {
  features: JurisdictionFeature[]
  sources: Record<string, Source>
}

export type ResolvedJurisdiction = {
  slug: string
  name: string
  tier: Tier
  role: Role
  basisYear: number
  /** False when any Source it relies on does not cover the Selected year. */
  attested: boolean
  /**
   * True when its Span rests on a placeholder rather than on a Source, so its
   * dates are the cataloguer's assumption. Separate from `attested`, which is
   * about whether the geometry is being drawn for a year its Source speaks to.
   */
  datesAssumed: boolean
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
        role: p.role ?? "roman",
        basisYear: p.basisYear,
        attested: sourceKeysFor(p).every((key) =>
          covers(corpus.sources[key], year),
        ),
        datesAssumed:
          corpus.sources[p.spanSource ?? p.source]?.placeholder === true,
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

/**
 * Which identity colour a Jurisdiction wears, as a slot number 1-5 matching
 * the `--color-map-realm-N` tokens.
 *
 * Colour follows the entity, never its position in the list, so a year with
 * fewer realms never repaints the survivors. Five slots cover ten realms
 * because the invariant that matters is narrower than "all distinct": no two
 * realms sharing a slot are ever on screen in the same year. The Roman
 * mainline keeps one slot throughout, so the thread stays readable as it
 * passes from Republic to Empire to West.
 *
 * The palette is Okabe-Ito, validated against the map's land surface. Its CVD
 * separation sits in the band that is only legal with secondary encoding,
 * which is why realms are always drawn with their names.
 */
export const REALM_COLOUR_SLOT: Record<string, 1 | 2 | 3 | 4 | 5> = {
  // The Roman mainline, never concurrent with itself.
  "roman-republic": 2,
  "roman-empire": 2,
  "western-roman-empire": 2,
  // The east, running 395 to 1453 and concurrent with everything after it.
  "eastern-roman-empire": 1,
  // The third-century breakaways, concurrent with the Empire and each other.
  "gallic-empire": 3,
  "palmyrene-empire": 4,
  // The post-1204 successors, concurrent with the east and each other.
  "latin-empire": 2,
  "nicaean-empire": 3,
  "empire-of-trebizond": 4,
  "despotate-of-epirus": 5,
}

export function colourSlotOf(slug: string): 1 | 2 | 3 | 4 | 5 {
  return REALM_COLOUR_SLOT[slug] ?? 1
}

/**
 * Where a Jurisdiction's name should sit: the centroid of its largest ring.
 *
 * The centroid of the whole feature would drift into the sea for anything
 * crescent-shaped around the Mediterranean, and the centre of the bounding
 * box is worse again.
 */
export function labelPointOf(
  feature: JurisdictionFeature,
): [number, number] | null {
  const geometry = feature.geometry
  if (!geometry || !("coordinates" in geometry)) return null

  let bestRing: number[][] | null = null
  let bestArea = 0

  const considerRing = (ring: unknown): void => {
    if (!Array.isArray(ring) || ring.length < 3) return
    const points = ring as number[][]
    if (typeof points[0]?.[0] !== "number") return

    let area = 0
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const a = points[j]
      const b = points[i]
      if (!a || !b) continue
      area += (a[0] ?? 0) * (b[1] ?? 0) - (b[0] ?? 0) * (a[1] ?? 0)
    }
    area = Math.abs(area / 2)
    if (area > bestArea) {
      bestArea = area
      bestRing = points
    }
  }

  const walk = (node: unknown, depth: number): void => {
    if (!Array.isArray(node)) return
    // A ring is the level whose children are [lng, lat] pairs.
    if (
      Array.isArray(node[0]) &&
      typeof (node[0] as number[])[0] === "number"
    ) {
      considerRing(node)
      return
    }
    if (depth > 4) return
    for (const child of node) walk(child, depth + 1)
  }

  walk(geometry.coordinates, 0)
  if (!bestRing) return null

  const ring = bestRing as number[][]
  let lngSum = 0
  let latSum = 0
  for (const point of ring) {
    lngSum += point[0] ?? 0
    latSum += point[1] ?? 0
  }
  return [lngSum / ring.length, latSum / ring.length]
}
