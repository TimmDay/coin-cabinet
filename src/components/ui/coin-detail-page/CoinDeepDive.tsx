"use client"

import { formatYearRange } from "~/lib/utils/date-formatting"
import { CoinSketchCompare } from "../CoinSketchCompare"
import { CoinSnapshot } from "../CoinSnapshot"

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

function CoinDetailsSection({ coin }: { coin: CoinDeepDiveProps["coin"] }) {
  // Build civilization text
  const civText = coin.civ_specific
    ? `${coin.civ.toUpperCase()}-${coin.civ_specific}`
    : coin.civ.toUpperCase()

  // Build mint and year text using the utility function
  const mintText = coin.mint
  const yearDisplay = formatYearRange(
    coin.mint_year_earliest,
    coin.mint_year_latest,
  )
  const yearText = yearDisplay || null

  // Build specs line (diameter | mass | die axis) - excluding reference
  const specs = [
    coin.diameter ? `${coin.diameter}mm` : null,
    coin.mass ? `${coin.mass}g` : null,
    coin.die_axis,
  ].filter(Boolean)

  return (
    <section className="artemis-card h-fit p-4">
      <div className="space-y-1 text-center">
        {/* Line 1: [Mint] ([mint year]) [denomination] | [diameter] | [mass] | [die axis] */}
        <div className="tracking-wide">
          {mintText && (
            <span className="mr-1 text-sm text-slate-400">{mintText}</span>
          )}
          {yearText && (
            <span className="mr-2 text-sm text-slate-400">{yearText}</span>
          )}
          <span className="text-lg font-medium text-slate-200">
            {coin.denomination.toUpperCase()}
          </span>
          {specs.length > 0 && (
            <span className="ml-2 text-sm text-slate-500">
              {specs.join(" | ")}
            </span>
          )}
        </div>

        {/* Line 2: [civ][-civ_specific] [reference] */}
        <div className="text-sm text-slate-400">
          {civText}
          {coin.reference && (
            <span className="ml-2 text-slate-500">{coin.reference}</span>
          )}
        </div>
      </div>

      {coin.flavour_text && (
        <footer className="mt-4 border-t border-slate-600 pt-4">
          <p className="text-xs leading-relaxed break-words text-slate-400 italic">
            {coin.flavour_text}
          </p>
        </footer>
      )}
    </section>
  )
}

function MapPlaceholder() {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-slate-600 bg-slate-700 p-6 lg:h-[300px]">
      <div className="text-center">
        <div className="mb-2 text-lg font-medium text-slate-300">
          Future Map
        </div>
        <div className="text-sm text-slate-500">
          Roman Empire & Mint Locations
        </div>
      </div>
    </div>
  )
}

export function CoinDeepDive({ coin }: CoinDeepDiveProps) {
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
      />

      {/* Mobile: Stacked Layout */}
      <div className="block space-y-6 lg:hidden">
        {/* Map Placeholder */}
        <MapPlaceholder />

        {/* Coin Snapshot */}
        <CoinSnapshot
          civ={coin.civ}
          civSpecific={coin.civ_specific}
          mint={coin.mint}
          mintYearEarliest={coin.mint_year_earliest}
          mintYearLatest={coin.mint_year_latest}
          diameter={coin.diameter}
          mass={coin.mass}
          dieAxis={coin.die_axis}
          reference={coin.reference}
          provenance={coin.provenance}
        />
      </div>

      {/* Desktop: Map and Snapshot Side by Side */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:gap-6">
        {/* Map Placeholder - Takes remaining space */}
        <MapPlaceholder />

        {/* CoinSnapshot - Takes minimal space needed */}
        <div className="flex items-center">
          <CoinSnapshot
            civ={coin.civ}
            civSpecific={coin.civ_specific}
            mint={coin.mint}
            mintYearEarliest={coin.mint_year_earliest}
            mintYearLatest={coin.mint_year_latest}
            diameter={coin.diameter}
            mass={coin.mass}
            dieAxis={coin.die_axis}
            reference={coin.reference}
            provenance={coin.provenance}
          />
        </div>
      </div>

      {/* Coin Details */}
      <CoinDetailsSection coin={coin} />
    </section>
  )
}
