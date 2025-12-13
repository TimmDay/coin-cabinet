"use client"

import dynamic from "next/dynamic"
import { useMints } from "~/api/mints"
import { useTimelines } from "~/api/timelines"
import { MintInfo } from "~/components/ui"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristics } from "~/lib/utils/physical-formatting"
import { DeepDiveCard } from "../DeepDiveCard"
import { CoinRow } from "./CoinRow"
import type { CoinEnhanced } from "~/types/api"

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("../../map/Map").then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200" />
    ),
  },
)

// Dynamically import TimelineWithMap component to prevent SSR issues with Leaflet
const TimelineWithMap = dynamic(
  () =>
    import("../../map/TimelineWithMap").then((mod) => ({
      default: mod.TimelineWithMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200" />
    ),
  },
)

type CoinDeepDiveProps = {
  coin: CoinEnhanced
}

// Data transformation helpers
function transformDeitiesToCards(deities: CoinEnhanced["deities"]) {
  return (
    deities?.map((deity) => ({
      title: deity.name,
      subtitle: deity.subtitle ?? "",
      primaryInfo: deity.flavour_text ?? "",
      secondaryInfo: undefined,
      footer: deity.features_coinage?.map((f) => f.name).join(", ") ?? "",
    })) ?? []
  )
}

function transformHistoricalFiguresToCards(
  figures: CoinEnhanced["historical_figures"],
) {
  return (
    figures?.map((figure: unknown) => {
      const figureAny = figure as Record<string, unknown>

      // Extract and validate numeric fields
      const birth = typeof figureAny.birth === "number" ? figureAny.birth : null
      const death = typeof figureAny.death === "number" ? figureAny.death : null
      const reignStart =
        typeof figureAny.reign_start === "number" ? figureAny.reign_start : null
      const reignEnd =
        typeof figureAny.reign_end === "number" ? figureAny.reign_end : null

      // Format year ranges
      const livedYears = formatYearRange(birth, death)
      const reignYears = formatYearRange(reignStart, reignEnd)

      // Build subtitle components
      const authorityText =
        (typeof figureAny.authority === "string" ? figureAny.authority : "") ??
        ""
      const lifeInfo = livedYears
        ? `lived ${livedYears.replace(/[()]/g, "")}`
        : ""
      const reignInfo = reignYears
        ? `reigned ${reignYears.replace(/[()]/g, "")}`
        : ""
      const subtitle = [authorityText, lifeInfo, reignInfo]
        .filter(Boolean)
        .join(", ")

      // Build footer from altNames or full_name
      const altNames = Array.isArray(figureAny.altNames)
        ? figureAny.altNames
        : []
      const fullName =
        typeof figureAny.full_name === "string" ? figureAny.full_name : ""
      const footerText = altNames.length > 0 ? altNames.join(", ") : fullName

      return {
        title: typeof figureAny.name === "string" ? figureAny.name : "",
        subtitle,
        primaryInfo:
          (typeof figureAny.flavour_text === "string"
            ? figureAny.flavour_text
            : "") ?? "",
        secondaryInfo: undefined,
        footer: footerText,
      }
    }) ?? []
  )
}

function createCoinCard(coin: CoinEnhanced) {
  // Build civilization text
  const civText = coin.civ_specific
    ? `${coin.civ.toUpperCase()}, ${coin.civ_specific}`
    : coin.civ.toUpperCase()

  // Build physical characteristics string
  const physicalCharacteristics = formatPhysicalCharacteristics(
    { diameter: coin.diameter, mass: coin.mass, dieAxis: coin.die_axis },
    { style: "compact" },
  )

  // Build subtitle with physical characteristics and civText
  const subtitle = physicalCharacteristics
    ? `${physicalCharacteristics} | ${civText}`
    : civText

  return {
    title: "COIN FLIP",
    subtitle,
    primaryInfo:
      [
        coin.mint,
        formatYearRange(coin.mint_year_earliest, coin.mint_year_latest),
      ]
        .filter(Boolean)
        .join(" ") || undefined,
    secondaryInfo:
      [coin.provenance, coin.flavour_text].filter(Boolean).join(" • ") ||
      undefined,
    footer: coin.reference ?? undefined,
  }
}

function buildTimelineForCoin(
  coin: CoinEnhanced,
  mints: ReturnType<typeof useMints>["data"],
  dbTimelines: ReturnType<typeof useTimelines>["data"],
) {
  // Get timeline from database based on coin's timeline IDs
  if (coin.timelines_id && coin.timelines_id.length > 0 && dbTimelines) {
    const coinTimeline = dbTimelines.find((timeline) =>
      coin.timelines_id!.includes(timeline.id),
    )
    if (coinTimeline) {
      return addCoinMintingEventToTimeline(
        coinTimeline.timeline,
        {
          denomination: coin.denomination,
          mint: coin.mint,
          mint_year_earliest: coin.mint_year_earliest,
          mint_year_latest: coin.mint_year_latest,
        },
        mints,
      )
    }
  }

  // No timeline found
  return null
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const isMapFeatureEnabled = useTypedFeatureFlag("map-feature")
  const { data: mints } = useMints()
  const { data: dbTimelines } = useTimelines()

  // Helper function to check if mint has actual data
  const getMintData = (mintName: string) => {
    if (!mints || !mintName?.trim()) return null
    const mint = mints.find(
      (m) =>
        m.alt_names?.some(
          (name) => name.toLowerCase() === mintName.toLowerCase(),
        ) ?? m.name.toLowerCase() === mintName.toLowerCase(),
    )
    return mint?.flavour_text ? mint : null
  }

  // Process data using helper functions
  const matchingTimeline = buildTimelineForCoin(coin, mints, dbTimelines)
  const matchingDeities = transformDeitiesToCards(coin.deities)
  const matchingHistoricalFigures = transformHistoricalFiguresToCards(
    coin.historical_figures,
  )

  // Helper to create a DeepDive card
  const createCard = (
    id: string,
    props: React.ComponentProps<typeof DeepDiveCard>,
  ) => ({
    id,
    component: <DeepDiveCard defaultOpen={false} {...props} />,
  })

  // Helper to create a mint card
  const createMintCard = (mintName: string) => ({
    id: "mint",
    component: <MintInfo mintName={mintName} />,
  })

  // Build cards array with only cards that have content
  const cardsToRender = [
    // This Coin Card (always shown)
    createCard("coin", createCoinCard(coin)),

    // Mint card (only if has data)
    ...(getMintData(coin.mint ?? "") ? [createMintCard(coin.mint!)] : []),

    // Deity cards
    ...matchingDeities
      .filter((deity) => deity.title?.trim())
      .map((deity, index) => createCard(`deity-${index}`, deity)),

    // Historical figure cards
    ...matchingHistoricalFigures
      .filter((figure) => figure.title?.trim())
      .map((figure, index) => createCard(`figure-${index}`, figure)),
  ]

  return (
    <section className="w-full space-y-8 md:space-y-12 md:overflow-x-hidden">
      {/* Coin Row Components */}
      {coin.image_link_o && (
        <CoinRow
          side="obverse"
          imageLink={coin.image_link_o}
          imageLinkAltlight={coin.image_link_altlight_o}
          imageLinkSketch={coin.image_link_sketch_o}
          legendExpanded={coin.legend_o_expanded}
          legendTranslation={coin.legend_o_translation}
          description={coin.desc_o}
          priority={true}
        />
      )}

      {coin.image_link_r && (
        <CoinRow
          side="reverse"
          imageLink={coin.image_link_r}
          imageLinkAltlight={coin.image_link_altlight_r}
          imageLinkSketch={coin.image_link_sketch_r}
          legendExpanded={coin.legend_r_expanded}
          legendTranslation={coin.legend_r_translation}
          description={coin.desc_r}
        />
      )}

      {/* Map Section */}
      {isMapFeatureEnabled && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="w-full">
            {matchingTimeline ? (
              <TimelineWithMap
                timeline={matchingTimeline}
                showHeaders={false}
                initialCenter={coin.mint ? undefined : [41.9028, 12.4964]}
                eventZoomLevel={6}
                mapProps={{
                  highlightMint: coin.mint ?? undefined,
                  height: "400px",
                }}
              />
            ) : (
              <Map
                highlightMint={coin.mint ?? undefined}
                hideControls
                height="400px"
              />
            )}
          </div>
        </div>
      )}

      {/* DeepDive Cards Section */}
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
          {cardsToRender.map((card) => (
            <div
              key={card.id}
              className="w-full lg:w-[calc(50%-0.5rem)] lg:flex-shrink-0"
            >
              {card.component}
            </div>
          ))}
        </div>
      </div>

      {/* Coin Details */}
      {coin.flavour_text && <FlavorFooter flavourText={coin.flavour_text} />}
    </section>
  )
}

function FlavorFooter({ flavourText }: { flavourText: string }) {
  return (
    <footer className="mt-4 border-t border-slate-600 pt-4">
      <p className="text-xs leading-relaxed break-words text-slate-400 italic">
        {flavourText}
      </p>
    </footer>
  )
}
