"use client"

import dynamic from "next/dynamic"
import { useCallback, useMemo, useRef, useState } from "react"
import { useJurisdictionCorpus } from "~/components/map/hooks"
import {
  changeYears,
  resolveAtYear,
  type Tier,
} from "~/components/map/jurisdictions"
import { MapControls } from "~/components/map/MapControls"
import { SegmentedControl } from "~/components/ui/SegmentedControl"
import { DataSources } from "~/components/map/DataSources"
import { TierControl } from "~/components/map/TierControl"
import { YearSlider } from "~/components/map/YearSlider"
import { NotFound404 } from "~/components/ui/NotFound404"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("~/components/map/Map").then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-raised h-full w-full animate-pulse rounded-lg" />
    ),
  },
)

type MarkerMode = "none" | "mints" | "cities" | "poi"

const MARKER_OPTIONS = [
  { value: "none", label: "No pins" },
  { value: "mints", label: "Mints" },
  { value: "cities", label: "Cities" },
  { value: "poi", label: "POI" },
] as const

/** Opens on Trajan's empire: the most recognisable shape on the slider. */
const INITIAL_YEAR = 117

export default function MapPage() {
  const isDevMode = useTypedFeatureFlag("dev")

  // Map state
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR)
  const [tier, setTier] = useState<Tier>("province")
  const [selectedProvinces, setSelectedProvinces] = useState<string[] | null>(
    null,
  )
  const [showProvinceLabels, setShowProvinceLabels] = useState(true)
  // Pins stay off until asked for: the map is about territory first, and a
  // hundred mint dots over it is not a default anyone chose. One choice at a
  // time, since POI already contains every city.
  const [markers, setMarkers] = useState<MarkerMode>("none")

  // Shared with the map through a module-level cache, so asking for it here
  // costs no second fetch.
  const corpus = useJurisdictionCorpus()
  const ticks = useMemo(() => (corpus ? changeYears(corpus) : []), [corpus])

  // Passing the Tier gives a provenance sentence about what is actually drawn,
  // while availableTiers still reflects every Tier with content that year.
  const resolution = useMemo(
    () => (corpus ? resolveAtYear(corpus, selectedYear, tier) : null),
    [corpus, selectedYear, tier],
  )

  /** Every province name the corpus can draw, for the selection control. */
  const provinceNames = useMemo(() => {
    if (!corpus) return []
    return [
      ...new Set(
        corpus.features
          .filter((f) => f.properties.tier === "province")
          .map((f) => f.properties.name),
      ),
    ].sort()
  }, [corpus])

  // Everything selected until the visitor says otherwise; the list is not
  // known until the corpus arrives, so it cannot be the initial state.
  const effectiveProvinces = selectedProvinces ?? provinceNames

  const fitRef = useRef<(() => void) | null>(null)
  const receiveFit = useCallback((fit: () => void) => {
    fitRef.current = fit
  }, [])

  // Show 404-like message if feature flag is not enabled
  if (!isDevMode) {
    return <NotFound404 />
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Full-size Map Container */}
      <div className="h-[calc(100vh-240px)] flex-shrink-0">
        <div className="h-full p-4 sm:p-6 lg:p-8">
          <div className="bg-paper h-full w-full overflow-hidden rounded-lg shadow-lg">
            <Map
              layout="fullscreen"
              height="100%"
              selectedYear={selectedYear}
              tier={tier}
              onFitExtent={receiveFit}
              selectedProvinces={effectiveProvinces}
              showProvinceLabels={showProvinceLabels}
              showMintMarkers={markers === "mints"}
              showCityMarkers={markers === "cities"}
              showPlaceMarkers={markers === "poi"}
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8">
        <YearSlider
          value={selectedYear}
          onChange={setSelectedYear}
          changeYears={ticks}
          onFitExtent={() => fitRef.current?.()}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <TierControl
              value={tier}
              onChange={setTier}
              available={resolution?.availableTiers ?? []}
            />
            <SegmentedControl
              legend="Which pins to show"
              name="map-markers"
              size="sm"
              options={MARKER_OPTIONS}
              value={markers}
              onChange={setMarkers}
            />
          </div>
          <DataSources
            provenance={resolution?.provenance ?? null}
            corpus={corpus}
            year={selectedYear}
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex-shrink-0 px-4 py-4 sm:px-6 lg:px-8">
        <MapControls
          selectedProvinces={selectedProvinces}
          onProvincesChange={setSelectedProvinces}
          provinceNames={provinceNames}
          showProvinceLabels={showProvinceLabels}
          onProvinceLabelsChange={setShowProvinceLabels}
        />
      </div>
    </div>
  )
}
