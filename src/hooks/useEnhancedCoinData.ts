"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useDeities } from "~/api/deities"
import { useTimelines } from "~/api/timelines"
import type { Timeline } from "~/database/schema-timelines"
import { useFeatureFlag } from "~/lib/hooks/useFeatureFlag"
import type { CoinApiResponse, CoinEnhanced } from "~/types/api"

type CoinEditData = {
  coin: CoinEnhanced
  deityOptions: { value: string; label: string; subtitle?: string }[]
  selectedDeities: { id: number; name: string; subtitle?: string }[]
  timelineOptions: { value: string; label: string }[]
  selectedTimelines: Timeline[]
  isLoading: boolean
  error: Error | null
  invalidateCache: () => void
}

export function useSpecificCoinData(coinId: number | null): CoinEditData {
  const queryClient = useQueryClient()
  const showHidden = useFeatureFlag("show-hidden-coins")

  // Cache all deities with longer stale time (they rarely change)
  const {
    data: allDeities,
    isLoading: deitiesLoading,
    error: deitiesError,
  } = useDeities()

  // Cache all timelines
  const {
    data: allTimelines,
    isLoading: timelinesLoading,
    error: timelinesError,
  } = useTimelines()

  // Fetch specific coin data with joined deities
  const {
    data: coinResponse,
    isLoading: coinLoading,
    error: coinError,
  } = useQuery({
    queryKey: ["specific-coin-with-deities", coinId],
    queryFn: async () => {
      if (!coinId || coinId <= 0) {
        throw new Error(`Invalid coin ID: ${coinId}`)
      }

      const url = `/api/somnus-collection/${coinId}?include=deities,historical-figures${showHidden ? "&showHidden=true" : ""}`

      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()

        if (response.status === 404) {
          // Only log 404s in development for debugging with more context
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[useSpecificCoinData] Coin not found: ID ${coinId} (URL: ${url})`,
            )
            console.trace("Call stack for 404 error:")
          }
          throw new Error(`Coin with ID ${coinId} not found`)
        }

        // Log other errors normally
        console.error(
          `Coin fetch failed: ${response.status} ${response.statusText}`,
          `URL: ${url}`,
          errorText,
        )

        throw new Error(
          `Failed to fetch coin: ${response.status} ${response.statusText}`,
        )
      }

      const result = (await response.json()) as CoinApiResponse
      return result.data
    },
    enabled: !!coinId && coinId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for coin data
  })

  const coinData = coinResponse

  // Transform data for component consumption
  const deityOptions =
    allDeities?.map((deity) => ({
      value: deity.id.toString(),
      label: deity.name,
      subtitle: deity.subtitle,
    })) ?? []

  const selectedDeities =
    coinData?.deity_id
      ?.map((id: string) => {
        const deity = allDeities?.find((d) => d.id.toString() === id)
        return deity
          ? {
              id: deity.id,
              name: deity.name,
              subtitle: deity.subtitle,
            }
          : null
      })
      .filter((deity): deity is NonNullable<typeof deity> => deity !== null) ??
    []

  // Transform timeline data for component consumption
  const timelineOptions =
    allTimelines?.map((timeline) => ({
      value: timeline.id.toString(),
      label: timeline.name,
    })) ?? []

  const selectedTimelines =
    coinData?.timelines_id
      ?.map((id: number) => {
        const timeline = allTimelines?.find((t) => t.id === id)
        return timeline || null
      })
      .filter(
        (timeline): timeline is NonNullable<typeof timeline> =>
          timeline !== null,
      ) ?? []

  // Cache invalidation function
  const invalidateCache = () => {
    void queryClient.invalidateQueries({
      queryKey: ["specific-coin-with-deities", coinId],
    })
    void queryClient.invalidateQueries({ queryKey: ["coin", coinId] })
    // Also invalidate any collection views that might show this coin
    void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
    void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
  }

  return {
    coin: coinData!,
    deityOptions,
    selectedDeities,
    timelineOptions,
    selectedTimelines,
    isLoading: deitiesLoading || timelinesLoading || coinLoading,
    error: deitiesError ?? timelinesError ?? coinError,
    invalidateCache,
  }
}
