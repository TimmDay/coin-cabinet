"use client"

import { useMemo } from "react"
import { useArtifacts } from "~/api/artifacts"
import { usePlaces } from "~/api/places"
import { useTimelines } from "~/api/timelines"
import type { CoinEnhanced } from "~/types/api"
import { buildCoinMap, type CoinMap } from "./coinMap"

/**
 * What a coin's deep dive map shows, or `null` when there is nothing to map
 * (yet). It loads the reference data itself, so the map fills in as that
 * arrives. The result only changes when the coin or that data does, which the
 * map relies on to keep its marker index.
 */
export function useCoinMap(coin: CoinEnhanced): CoinMap | null {
  const { data: timelines } = useTimelines()
  const { data: artifacts } = useArtifacts()
  const { data: places } = usePlaces()

  return useMemo(
    () => buildCoinMap(coin, { timelines, places, artifacts }),
    [coin, timelines, places, artifacts],
  )
}
