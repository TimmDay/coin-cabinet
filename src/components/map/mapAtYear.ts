import {
  boundsOf,
  labelPointOf,
  resolveAtYear,
  tierWithData,
  type Corpus,
  type Provenance,
  type Role,
  type Tier,
} from "./jurisdictions"

export type JurisdictionLabel = {
  /** With an asterisk when the Jurisdiction's dates are assumed. */
  name: string
  tier: Tier
  lng: number
  lat: number
}

export type MapAtYear = {
  /** The Tier drawn: the one asked for, or the fallback. Undefined for all Tiers. */
  tier: Tier | undefined
  /** Tiers holding at least one Jurisdiction at the Selected year. */
  availableTiers: Tier[]
  /** What to draw, or null when nothing is. */
  features: GeoJSON.FeatureCollection | null
  labels: JurisdictionLabel[]
  /** [west, south, east, north] around the Jurisdictions of the Tier, or null. */
  bounds: [number, number, number, number] | null
  provenance: Provenance
}

export type MapAtYearOptions = {
  year: number
  /** The Tier to draw; all Tiers when omitted. */
  tier?: Tier
  /**
   * When the Tier asked for is empty at this year, draw one that is not. For a
   * coin's map, which opens on a Tier chosen without knowing its year. Off on
   * the year slider, where an empty Tier is a fact about that year.
   */
  fallback?: boolean
  /** Non-Roman Roles to draw alongside Rome; none by default. */
  outsiderRoles?: Role[]
  /** Provinces to draw; all of them when omitted. Realms are never narrowed. */
  selectedProvinces?: string[]
}

/** Everything the map draws of the Jurisdictions at a Selected year. */
export function mapAtYear(
  corpus: Corpus,
  {
    year,
    tier,
    fallback = false,
    outsiderRoles = [],
    selectedProvinces,
  }: MapAtYearOptions,
): MapAtYear {
  let resolution = resolveAtYear(corpus, year, tier)
  let shown = tier
  if (fallback && tier) {
    shown = tierWithData(tier, resolution.availableTiers)
    if (shown !== tier) resolution = resolveAtYear(corpus, year, shown)
  }

  const labels = resolution.jurisdictions.flatMap((j) => {
    const point = labelPointOf(j.feature)
    // An asterisk marks a Jurisdiction whose dates are assumed rather than
    // sourced, so a reader can tell at a glance which of these the map is
    // guessing about.
    return point
      ? [
          {
            name: j.datesAssumed ? `${j.name}*` : j.name,
            tier: j.tier,
            lng: point[0],
            lat: point[1],
          },
        ]
      : []
  })

  // Which Jurisdictions to show is a separate axis from which ones existed,
  // so the selection narrows what the year already resolved.
  const drawn = resolution.jurisdictions
    .filter((j) => j.role === "roman" || outsiderRoles.includes(j.role))
    .filter(
      (j) =>
        !selectedProvinces ||
        j.tier !== "province" ||
        selectedProvinces.includes(j.name),
    )
    // `attested` has to reach MapLibre as a property: a reconstruction is
    // drawn with a broken outline, and dasharray cannot be data-driven, so
    // the two cases are split across two line layers filtered on this.
    .map((j) => ({
      ...j.feature,
      properties: { ...j.feature.properties, attested: j.attested },
    }))

  return {
    tier: shown,
    availableTiers: resolution.availableTiers,
    features:
      drawn.length > 0 ? { type: "FeatureCollection", features: drawn } : null,
    labels,
    bounds: boundsOf(resolution.jurisdictions),
    provenance: resolution.provenance,
  }
}
