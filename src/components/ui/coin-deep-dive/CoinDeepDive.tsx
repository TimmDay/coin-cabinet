"use client"

import dynamic from "next/dynamic"
import { useMints } from "~/api/mints"
import { useTimelines } from "~/api/timelines"
import { addCoinMintingEventToTimeline } from "~/lib/utils/coin-timeline"
import type { CoinEnhanced } from "~/types/api"
import { CoinRow } from "./CoinRow"
import { DeepDiveCardsSection } from "./DeepDiveCardsSection"

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
function buildTimelineForCoin(
  coin: CoinEnhanced,
  dbTimelines: ReturnType<typeof useTimelines>["data"],
  mints: ReturnType<typeof useMints>["data"],
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
          mint_id: coin.mint_id,
          mint_year_earliest: coin.mint_year_earliest,
          mint_year_latest: coin.mint_year_latest,
        },
        mints, // Pass mints data for timeline event creation
      )
    }
  }

  // No timeline found
  return null
}

function getMintCoordinates(
  coin: CoinEnhanced,
  mints: ReturnType<typeof useMints>["data"],
): [number, number] | null {
  if (!coin.mint_id || !mints) return null

  const mint = mints.find((m) => m.id === coin.mint_id)
  if (!mint?.lat || !mint?.lng) return null

  return [mint.lat, mint.lng]
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const { data: dbTimelines } = useTimelines()
  const { data: mints } = useMints()

  // Process data using helper functions
  const matchingTimeline = buildTimelineForCoin(coin, dbTimelines, mints)
  const mintCoords = getMintCoordinates(coin, mints)

  // Get mint name for map highlighting
  const mint =
    coin.mint_id && mints ? mints.find((m) => m.id === coin.mint_id) : null
  const mintName = mint?.name

  // Determine map display logic - show timeline map if available, otherwise mint map
  const shouldShowMap = Boolean(matchingTimeline || mintCoords)
  const mapCenter = mintCoords ?? undefined

  return (
    <section className="w-full space-y-8 md:space-y-12 md:overflow-x-hidden">
      {/* Coin Row Components */}
      {coin.image_link_o && (
        <CoinRow
          side="obverse"
          imageLink={coin.image_link_o}
          imageLinkAltlight={coin.image_link_altlight_o}
          imageLinkSketch={coin.image_link_sketch_o}
          legendExpanded={coin.legend_o_expanded || coin.legend_o}
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
          legendExpanded={coin.legend_r_expanded || coin.legend_r}
          legendTranslation={coin.legend_r_translation}
          description={coin.desc_r}
        />
      )}

      {/* Map Section */}
      {shouldShowMap && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="w-full">
            {matchingTimeline ? (
              <TimelineWithMap
                timeline={matchingTimeline}
                showHeaders={false}
                initialCenter={mapCenter}
                eventZoomLevel={6}
                mapProps={{
                  highlightMint: mintName,
                  height: "400px",
                }}
              />
            ) : mintCoords ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800">
                  Mint Location: {mintName}
                </h3>
                <Map
                  center={mintCoords}
                  highlightMint={mintName}
                  hideControls
                  height="400px"
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* DeepDive Cards Section */}
      <DeepDiveCardsSection
        coinData={coin}
        deities={coin.deities}
        historicalFigures={coin.historical_figures}
      />

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
