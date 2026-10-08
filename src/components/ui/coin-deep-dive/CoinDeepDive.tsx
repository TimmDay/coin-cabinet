"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { useDevices } from "~/api/devices"
import { useFoldFill } from "~/hooks/useFoldFill"
import { MAP_HEIGHT_DESKTOP } from "~/lib/constants"
import { cn } from "~/lib/utils"
import { deepDiveMapViewFor } from "~/components/map/deepDiveMapView"
import { type Tier } from "~/components/map/jurisdictions"
import { useInViewport } from "~/hooks/useInViewport"
import type { CoinEnhanced } from "~/types/api"
import { clockNoteRoom } from "./CoinClockTips"
import { CoinRow } from "./CoinRow"
import { DeepDiveCardsSection } from "./DeepDiveCardsSection"
import { useCoinMap } from "./useCoinMap"

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(
  () => import("../../map/Map").then((mod) => ({ default: mod.Map })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-raised h-96 w-full animate-pulse rounded-lg" />
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
      <div className="bg-surface-raised h-96 w-full animate-pulse rounded-lg" />
    ),
  },
)

type CoinDeepDiveProps = {
  coin: CoinEnhanced
}

/** How much of the next section shows above the fold on desktop. */
const FOLD_PEEK_PX = 32

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const { data: allDevices = [] } = useDevices()

  const obvDevices = allDevices.filter((d) =>
    coin.obv_device_ids?.includes(d.id),
  )
  const revDevices = allDevices.filter((d) =>
    coin.rev_device_ids?.includes(d.id),
  )

  const coinMap = useCoinMap(coin)

  // The map sits below the fold, and mounting it pulls maplibre (about 280KB
  // gzipped), its worker (another 143KB) and the Jurisdiction corpus. None of
  // that should be on the critical path for a page whose point is the coin.
  // rootMargin starts the fetch slightly before it scrolls into view, so it is
  // usually ready by the time it is looked at.
  const mapSectionRef = useRef<HTMLDivElement>(null)
  const mapInView = useInViewport(mapSectionRef, { rootMargin: "400px" })
  // Where the map opens, which depends on the coin's culture or period
  const mapView = deepDiveMapViewFor(coin.civ, coinMap?.selectedYear)
  const [tier, setTier] = useState<Tier>(mapView.tier)

  const clockNotes = coin.clock_notes ?? []
  const clockNotesFor = (side: "obverse" | "reverse") =>
    clockNotes.filter((note) => note.side === side)
  // On desktop the coins fill the first screen, centred, with the start of the
  // map just showing at the bottom
  const foldRef = useFoldFill<HTMLDivElement>(FOLD_PEEK_PX)

  // Both faces share the same room, so the coins and legends stay level
  const clockRoom = clockNoteRoom(clockNotes)

  return (
    <section className="[container-type:inline-size] w-full space-y-8 md:space-y-12 md:overflow-x-hidden">
      {/* Obverse and reverse: stacked on small screens, side by side on desktop */}
      <div
        ref={foldRef}
        className={`[container-type:inline-size] flex flex-col gap-8 md:gap-12 lg:grid lg:content-center lg:justify-center lg:gap-x-2 lg:gap-y-6 xl:gap-x-8 ${
          coin.image_link_o && coin.image_link_r
            ? "lg:grid-cols-[auto_auto]"
            : "lg:grid-cols-[auto]"
        }`}
      >
        {coin.image_link_o && (
          <CoinRow
            side="obverse"
            imageLink={coin.image_link_o}
            imageLinkAltlight={coin.image_link_altlight_o}
            imageLinkSketch={coin.image_link_sketch_o}
            legendExpanded={coin.legend_o_expanded || coin.legend_o}
            legendTranslation={coin.legend_o_translation}
            description={coin.desc_o}
            flavourText={coin.flavour_obv}
            devices={obvDevices}
            clockNotes={clockNotesFor("obverse")}
            reserveTop={clockRoom.top}
            reserveBottom={clockRoom.bottom}
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
            mintMark={coin.mint_mark}
            description={coin.desc_r}
            flavourText={coin.flavour_rev}
            devices={revDevices}
            clockNotes={clockNotesFor("reverse")}
            reserveTop={clockRoom.top}
            reserveBottom={clockRoom.bottom}
          />
        )}
      </div>

      {/* Map Section */}
      {coinMap && (
        <div
          ref={mapSectionRef}
          className={cn(
            "mx-auto w-full px-4 pt-6 md:pt-10",
            // With both faces, line up with the coins and legends above: two
            // coin columns (coin plus 112px of room each) and the gap between.
            coin.image_link_o && coin.image_link_r
              ? "lg:w-[var(--deep-dive-width)] lg:px-0 lg:[--coin-size:clamp(350px,min(calc((100cqw-256px)/2),calc(100vh-420px)),580px)] lg:[--deep-dive-width:calc(2*(var(--coin-size)+112px)+0.5rem)] xl:[--deep-dive-width:calc(2*(var(--coin-size)+112px)+2rem)]"
              : "max-w-6xl",
          )}
        >
          {!mapInView ? (
            // Holds the space so nothing below jumps when the map arrives.
            <div
              className="bg-surface-raised h-[400px] w-full animate-pulse rounded-lg"
              aria-hidden="true"
            />
          ) : coinMap.kind === "timeline" ? (
            <TimelineWithMap
              timeline={coinMap.timeline}
              showHeaders={false}
              initialCenter={mapView.center}
              initialZoom={mapView.zoom}
              initialTier={mapView.tier}
              previewCenter={mapView.center}
              eventZoomLevel={6}
              additionalMarkers={coinMap.markers}
              showDefaultMintMarkers={false}
              selectedYear={coinMap.selectedYear}
              mapProps={{
                height: "400px",
              }}
            />
          ) : (
            <div className="space-y-4">
              <Map
                center={mapView.center}
                zoom={mapView.zoom}
                showMintMarkers={false}
                customMarkers={coinMap.markers}
                height="400px"
                desktopHeight={MAP_HEIGHT_DESKTOP}
                {...(coinMap.selectedYear !== null
                  ? {
                      selectedYear: coinMap.selectedYear,
                      tier,
                      onTierChange: setTier,
                      fallbackToTierWithData: true,
                    }
                  : {})}
              />
            </div>
          )}
        </div>
      )}

      {/* DeepDive Cards Section */}
      <DeepDiveCardsSection
        coinData={coin}
        deities={coin.deities}
        historicalFigures={coin.historical_figures}
      />
    </section>
  )
}
