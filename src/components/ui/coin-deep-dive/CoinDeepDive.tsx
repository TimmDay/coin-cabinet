"use client"

import dynamic from "next/dynamic"
import { useMints } from "~/api/mints"
import { MintInfo } from "~/components/ui"
import { DEITIES } from "~/data/deities"
import { TIMELINES } from "~/data/timelines"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristics } from "~/lib/utils/physical-formatting"
import { matchTimelineToNickname } from "~/lib/utils/timeline-matcher"
import { DeepDiveCard } from "../DeepDiveCard"
import { CoinRow } from "./CoinRow"

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

import type { CoinEnhanced } from "~/types/api"

type CoinDeepDiveProps = {
  coin: CoinEnhanced
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const isMapFeatureEnabled = useTypedFeatureFlag("map-feature")
  const { data: mints } = useMints()

  // Check if there's a matching timeline for this coin
  const baseTimeline = matchTimelineToNickname(coin.nickname, TIMELINES)

  // Add coin minting event to timeline if we have one
  const matchingTimeline = baseTimeline
    ? addCoinMintingEventToTimeline(
        baseTimeline,
        {
          denomination: coin.denomination,
          mint: coin.mint,
          mint_year_earliest: coin.mint_year_earliest,
          mint_year_latest: coin.mint_year_latest,
        },
        mints,
      )
    : null

  // Transform database deity data to DeepDiveCard format matching UI card structure
  const transformDbDeityToCard = (deity: {
    id: number
    name: string
    subtitle?: string
    flavour_text?: string | null
    secondary_info?: string | null
    features_coinage?: { name: string; alt_name?: string; notes?: string }[]
  }) => {
    const coinageFeatureNames =
      deity.features_coinage?.map((f) => f.name).join(", ") ?? ""

    const result = {
      title: deity.name,
      subtitle: deity.subtitle ?? "",
      primaryInfo: deity.flavour_text ?? "",
      secondaryInfo: deity.secondary_info ?? "",
      footer: coinageFeatureNames,
    }

    return result
  }
  // Use database deity information if available, otherwise fallback to devices lookup
  const matchingDeities =
    coin.deities && coin.deities.length > 0
      ? coin.deities.map(transformDbDeityToCard) // Transform database deities
      : coin.devices // Fallback to static DEITIES lookup for backwards compatibility
        ? coin.devices
            .map((device) => {
              const deityKey = device.toLowerCase()
              if (deityKey in DEITIES) {
                return DEITIES[deityKey]
              }
              return null
            })
            .filter(
              (deity): deity is NonNullable<typeof deity> => deity !== null,
            )
        : []

  return (
    <section className="space-y-8 md:space-y-12">
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

      {/* Map Section - show Timeline+Map if matching timeline, otherwise regular Map */}
      {isMapFeatureEnabled && (
        <div className="flex justify-center">
          <div className="w-full max-w-none md:w-[calc(100%-150px)]">
            {matchingTimeline ? (
              <TimelineWithMap
                timeline={matchingTimeline}
                showHeaders={false}
                initialCenter={coin.mint ? undefined : [41.9028, 12.4964]} // Let map center on mint if available
                eventZoomLevel={6}
                mapProps={{
                  highlightMint: coin.mint ?? undefined,
                  height: "400px",
                }}
              />
            ) : (
              <Map
                highlightMint={coin.mint ?? undefined}
                hideControls={true}
                height="400px"
              />
            )}
          </div>
        </div>
      )}

      {/* DeepDive Cards Section - Side by Side Layout */}
      <div className="flex justify-center">
        <div className="w-full max-w-none md:w-[calc(100%-150px)]">
          {/* Cards in separate columns - mobile stacks, desktop 2 independent columns */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            {/* Left Column - This Coin and Mint Information */}
            <div className="flex flex-1 flex-col gap-2">
              {/* This Coin Card - First */}
              <DeepDiveCard
                defaultOpen={false}
                title={` This ${coin.denomination}`}
                subtitle={
                  formatPhysicalCharacteristics(
                    {
                      diameter: coin.diameter,
                      mass: coin.mass,
                      dieAxis: coin.die_axis,
                    },
                    { style: "compact" },
                  ) ?? ""
                }
                primaryInfo={
                  [
                    coin.mint,
                    formatYearRange(
                      coin.mint_year_earliest,
                      coin.mint_year_latest,
                    ),
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                secondaryInfo={coin.flavour_text ?? undefined}
                footer={
                  [
                    coin.reference ? `${coin.reference}` : null,
                    coin.provenance ? ` ${coin.provenance}` : null,
                  ]
                    .filter(Boolean)
                    .join("") || undefined
                }
              />
              {/* Mint Information - Second */}
              {coin.mint && <MintInfo mintName={coin.mint} />}
            </div>

            {/* Right Column - Deity Cards */}
            <div className="flex flex-1 flex-col gap-2">
              {/* Deity Cards */}
              {matchingDeities.map((deity, index) => (
                <DeepDiveCard
                  key={index}
                  defaultOpen={false}
                  title={deity.title}
                  subtitle={deity.subtitle}
                  primaryInfo={deity.primaryInfo}
                  secondaryInfo={deity.secondaryInfo}
                  footer={deity.footer}
                />
              ))}
            </div>
          </div>
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
