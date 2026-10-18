"use client"

import { useMemo } from "react"
import { useTimelines } from "~/api/timelines"
import type { CoinEnhanced } from "~/types/api"
import { buildCoinMap, type CoinMap } from "./coinMap"

/**
 * What a coin's deep dive map shows, or `null` when there is nothing to map
 * (yet). Everything but the timelines comes with the coin; the timelines load
 * here, so the timeline map fills in as they arrive. The result only changes
 * when the coin or the timelines do, which the map relies on to keep its
 * marker index.
 */
export function useCoinMap(coin: CoinEnhanced): CoinMap | null {
  const { data: timelines } = useTimelines()

  return useMemo(() => buildCoinMap(coin, { timelines }), [coin, timelines])
}
