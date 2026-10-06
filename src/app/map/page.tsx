"use client"

import dynamic from "next/dynamic"
import { useCallback, useMemo, useRef, useState } from "react"
import { useJurisdictionCorpus } from "~/components/map/hooks"
import {
  changeYears,
  resolveAtYear,
  type Tier,
  type Role,
} from "~/components/map/jurisdictions"
import { TRAJAN_BOUNDS } from "~/components/map/mapConfig"
import { MapControls } from "~/components/map/MapControls"
import { ToggleGroup } from "~/components/ui/SegmentedControl"
import { DataSources } from "~/components/map/DataSources"
import { TierControl } from "~/components/map/TierControl"
import { YearSlider } from "~/components/map/YearSlider"

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

type MarkerLayer = "mints" | "cities" | "poi"

/**
 * The non-Roman world, off by default. The map is about Rome; everything it
 * fought, absorbed or bordered is opt-in context, which also keeps the Realm
 * identity palette from having to stretch past its validated five slots.
 */
const OUTSIDER_OPTIONS = [
  { value: "client", label: "Clients" },
  { value: "adversary", label: "Adversaries" },
] as const

const MARKER_OPTIONS = [
  { value: "mints", label: "Mints" },
  { value: "cities", label: "Cities" },
  { value: "poi", label: "POI" },
] as const

/**
 * Moments worth jumping to, each with the Tier that actually shows it. Setting
 * the year alone would not be enough: Diocletian's reorganisation is invisible
 * at Realm level, where AD 293 looks like any other year, and the Gallic and
 * Palmyrene breakaways are invisible among the administrative areas.
 *
 * Years checked against the committed corpus, not from memory.
 */
const MOMENTS = [
  {
    label: "After 1st Punic",
    year: -241,
    tier: "province" as Tier,
    title:
      "241 BC. Sicily, taken from Carthage, becomes the first province Rome ever had. Until now the map shows only Italy, which was never one.",
  },
  {
    // 197, not 201. The war ended in 201, but Rome did not organise the Spains
    // into provinces until 197, and 197 is what the data attests.
    label: "After 2nd Punic",
    year: -197,
    tier: "province" as Tier,
    title:
      "197 BC. Rome organises the Spains into provinces, four years after the war ended.",
  },
  {
    label: "Augustus",
    year: 7,
    tier: "province" as Tier,
    title:
      "AD 7. Augustus divides Italy into eleven numbered districts: the administrative areas jump from 32 to 42 in a single year.",
  },
  {
    label: "Four Emperors",
    year: 69,
    tier: "province" as Tier,
    title:
      "AD 69. Galba, Otho, Vitellius, Vespasian. A succession crisis rather than a territorial one, so the borders barely move.",
  },
  {
    label: "Trajan's peak",
    year: 117,
    tier: "realm" as Tier,
    title: "AD 117. The empire at its greatest extent.",
  },
  {
    label: "Three empires",
    year: 265,
    tier: "realm" as Tier,
    title: "AD 265. The Gallic and Palmyrene breakaways, either side of Rome.",
  },
  {
    label: "Diocletian",
    year: 293,
    tier: "province" as Tier,
    title:
      "AD 293. The reorganisation. The eleven Italian districts end here; the provinces he created are not in this map, so the count falls where it should rise.",
  },
  {
    label: "East and West",
    year: 395,
    tier: "realm" as Tier,
    title: "AD 395. The empire divided for the last time.",
  },
] as const

/** Opens on Trajan's empire: the most recognisable shape on the slider. */
const INITIAL_YEAR = 117

export default function MapPage() {
  // Map state
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR)
  // On by default: the Republic in particular is unreadable without its
  // rivals, since Rome spent those centuries as one power among several.
  const [outsiderRoles, setOutsiderRoles] = useState<Role[]>([
    "client",
    "adversary",
  ])
  const [tier, setTier] = useState<Tier>("realm")
  const [selectedProvinces, setSelectedProvinces] = useState<string[] | null>(
    null,
  )
  const [showProvinceLabels, setShowProvinceLabels] = useState(true)
  // Pins stay off until asked for: the map is about territory first, and a
  // hundred mint dots over it is not a default anyone chose. They combine
  // freely; POI contains every city, and the map draws each place once.
  const [markers, setMarkers] = useState<MarkerLayer[]>([])

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

  return (
    <div className="flex min-h-screen flex-col">
      {/* An explicit height, not flex-1: the page is min-h-screen, so its
          height comes from content, and a flex child of it has no definite
          height for these h-full children to resolve against, which collapsed
          the map to nothing.
          
          The subtraction is the chrome below and above: roughly 80px of nav,
          180px of slider card, 45px of control pills and 120px of the
          administrative areas panel, whose space is held whether or not it is
          showing. Adjust this one number if the slider sits below the fold.

          Deliberately short of the measured slack by about 20px: the chrome
          figures are estimates, and overshooting puts the slider back under
          the fold, which is the thing this is for. */}
      <div className="h-[calc(100dvh-330px)] min-h-[360px] flex-shrink-0">
        <div className="h-full px-2 pt-4 pb-2 sm:px-3 sm:pt-5 sm:pb-3">
          <div className="bg-paper h-full w-full overflow-hidden rounded-lg shadow-lg">
            <Map
              layout="fullscreen"
              height="100%"
              initialBounds={TRAJAN_BOUNDS}
              selectedYear={selectedYear}
              tier={tier}
              outsiderRoles={outsiderRoles}
              onFitExtent={receiveFit}
              selectedProvinces={effectiveProvinces}
              showProvinceLabels={showProvinceLabels}
              showMintMarkers={markers.includes("mints")}
              showCityMarkers={markers.includes("cities")}
              showPlaceMarkers={markers.includes("poi")}
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
          moments={MOMENTS}
          onPickMoment={(moment) => {
            setSelectedYear(moment.year)
            setTier(moment.tier)
          }}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <TierControl
              value={tier}
              onChange={setTier}
              available={resolution?.availableTiers ?? []}
            />
            <ToggleGroup
              legend="Show clients and adversaries"
              size="sm"
              options={OUTSIDER_OPTIONS}
              value={outsiderRoles}
              onChange={setOutsiderRoles}
            />
            <ToggleGroup
              legend="Which pins to show"
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

      {/* Always laid out, so the page does not jump when the Tier changes;
          hidden rather than unmounted when it controls nothing on screen.
          visibility:hidden also takes it out of the tab order. */}
      <div
        className={`flex-shrink-0 px-4 py-3 sm:px-6 lg:px-8 ${
          tier === "province" ? "" : "invisible"
        }`}
        aria-hidden={tier === "province" ? undefined : true}
      >
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
