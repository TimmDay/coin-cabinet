"use client"

import dynamic from "next/dynamic"
import { useTypedFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import { CoinSketchCompare } from "../CoinSketchCompare"

// Dynamically import Map component to prevent SSR issues with Leaflet
const Map = dynamic(() => import("../../map/Map").then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-200 rounded-lg" />
})

type CoinDeepDiveProps = {
  coin: {
    nickname?: string | null
    image_link_o?: string | null
    image_link_r?: string | null
    image_link_sketch_o?: string | null
    image_link_sketch_r?: string | null
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

function FlavorFooter({ coin }: { coin: CoinDeepDiveProps["coin"] }) {
  return (
    <footer className="mt-4 border-t border-slate-600 pt-4">
      <p className="text-xs leading-relaxed break-words text-slate-400 italic">
        {coin.flavour_text}
      </p>
    </footer>
  )
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
  const isMapFeatureEnabled = useTypedFeatureFlag("map-feature")
  return (
    <section className="space-y-6">
      {/* Coin Sketch Compare Component */}
      <CoinSketchCompare
        imageLinkO={coin.image_link_o ?? ""}
        imageLinkSketchO={coin.image_link_sketch_o}
        imageLinkR={coin.image_link_r ?? ""}
        imageLinkSketchR={coin.image_link_sketch_r}
        legendExpandedO={coin.legend_o_expanded}
        legendTranslationO={coin.legend_o_translation}
        legendExpandedR={coin.legend_r_expanded}
        legendTranslationR={coin.legend_r_translation}
        descO={coin.desc_o}
        descR={coin.desc_r}
      />

      {/* Map Section */}

      {isMapFeatureEnabled && <Map />}

      {/* Coin Details */}
      {coin.flavour_text && <FlavorFooter coin={coin} />}
    </section>
  )
}
