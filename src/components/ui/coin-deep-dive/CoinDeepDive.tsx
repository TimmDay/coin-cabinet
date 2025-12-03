"use client"

import dynamic from "next/dynamic"
import { useMints } from "~/api/mints"
import { MintInfo } from "~/components/ui"
import { TIMELINES } from "~/data/timelines"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import { formatYearRange } from "~/lib/utils/date-formatting"
import { formatPhysicalCharacteristics } from "~/lib/utils/physical-formatting"
import { matchTimelineToNickname } from "~/lib/utils/timeline-matcher"
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

  // Transform database deity data to DeepDiveCard format
  const matchingDeities =
    coin.deities?.map((deity) => ({
      title: deity.name,
      subtitle: deity.subtitle ?? "",
      primaryInfo: deity.flavour_text ?? "",
      secondaryInfo: (deity.secondary_info as string) ?? undefined,
      footer: deity.features_coinage?.map((f) => f.name).join(", ") ?? "",
    })) ?? []

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

      {/* Map Section */}
      {isMapFeatureEnabled && (
        <div className="flex justify-center">
          <div className="w-full md:w-[calc(100%-150px)]">
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
      <div className="flex justify-center">
        <div className="w-full md:w-[calc(100%-150px)]">
          <div className="flex flex-wrap justify-center gap-4">
            {/* This Coin Card */}
            <CardWrapper>
              <DeepDiveCard
                defaultOpen={false}
                title={`This ${coin.denomination}`}
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
                  [coin.reference, coin.provenance].filter(Boolean).join(" ") ||
                  undefined
                }
              />
            </CardWrapper>

            {/* Mint Information */}
            {coin.mint && (
              <CardWrapper>
                <MintInfo mintName={coin.mint} />
              </CardWrapper>
            )}

            {/* Deity Cards */}
            {matchingDeities.map((deity, index) => (
              <CardWrapper key={index}>
                <DeepDiveCard
                  defaultOpen={false}
                  title={deity.title}
                  subtitle={deity.subtitle}
                  primaryInfo={deity.primaryInfo}
                  secondaryInfo={deity.secondaryInfo}
                  footer={deity.footer}
                />
              </CardWrapper>
            ))}
          </div>
        </div>
      </div>

      {/* Coin Details */}
      {coin.flavour_text && <FlavorFooter flavourText={coin.flavour_text} />}
    </section>
  )
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-w-[400px] md:min-w-[600px] lg:w-[calc(50%-8px)] lg:min-w-[500px]">
      {children}
    </div>
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
