"use client"

import dynamic from "next/dynamic"
import { TIMELINES } from "~/components/map/timelines/timelines"
import { MintInfo } from "~/components/ui"
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

type CoinDeepDiveProps = {
  coin: {
    nickname?: string | null
    image_link_o?: string | null
    image_link_r?: string | null
    image_link_sketch_o?: string | null
    image_link_sketch_r?: string | null
    image_link_altlight_o?: string | null
    image_link_altlight_r?: string | null
    legend_o_expanded?: string | null
    legend_o_translation?: string | null
    legend_r_expanded?: string | null
    legend_r_translation?: string | null
    desc_o?: string | null
    desc_r?: string | null
    civ: string
    civ_specific?: string | null
    denomination: string
    mint?: string | null
    mint_year_earliest?: number | null
    mint_year_latest?: number | null
    diameter?: number | null
    mass?: number | null
    die_axis?: string | null
    reference?: string | null
    provenance?: string | null
    sets?: string[] | null
    flavour_text?: string | null
  }
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const isMapFeatureEnabled = useTypedFeatureFlag("map-feature")

  // Check if there's a matching timeline for this coin
  const baseTimeline = matchTimelineToNickname(coin.nickname, TIMELINES)

  // Add coin minting event to timeline if we have one
  const matchingTimeline = baseTimeline
    ? addCoinMintingEventToTimeline(baseTimeline, {
        denomination: coin.denomination,
        mint: coin.mint,
        mint_year_earliest: coin.mint_year_earliest,
        mint_year_latest: coin.mint_year_latest,
      })
    : null

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
            {/* Left Column - Mint Information */}
            <div className="flex-1 space-y-2">
              {coin.mint && <MintInfo mintName={coin.mint} />}
            </div>

            {/* Right Column - Coin Details */}
            <div className="flex-1 space-y-2">
              <DeepDiveCard
                defaultOpen={true}
                title={coin.denomination}
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
