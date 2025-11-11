"use client"

import dynamic from "next/dynamic"
import { MintInfo } from "~/components/ui"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
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
  return (
    <section className="space-y-6">
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
          <div className="w-full max-w-none md:w-[calc(100%-150px)]">
            <Map
              highlightMint={coin.mint ?? undefined}
              hideControls={true}
              height="400px"
            />
          </div>
        </div>
      )}

      {/* Mint Information Section */}
      {isMapFeatureEnabled && coin.mint && (
        <div className="flex justify-center">
          <div className="w-full max-w-none md:w-[calc(100%-150px)]">
            <MintInfo mintName={coin.mint} />
          </div>
        </div>
      )}

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
