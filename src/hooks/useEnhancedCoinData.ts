"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useDeities } from "~/api/deities"
import type { CoinApiResponse, CoinEnhanced } from "~/types/api"

type CoinEditData = {
  coin: CoinEnhanced
  deityOptions: { value: string; label: string; subtitle?: string }[]
  selectedDeities: { id: number; name: string; subtitle?: string }[]
  isLoading: boolean
  error: Error | null
  invalidateCache: () => void
}

export function useSpecificCoinData(coinId: number | null): CoinEditData {
  const queryClient = useQueryClient()

  // Cache all deities with longer stale time (they rarely change)
  const {
    data: allDeities,
    isLoading: deitiesLoading,
    error: deitiesError,
  } = useDeities()

  // Fetch specific coin data with joined deities
  const {
    data: coinResponse,
    isLoading: coinLoading,
    error: coinError,
  } = useQuery({
    queryKey: ["specific-coin-with-deities", coinId],
    queryFn: async () => {
      if (!coinId) throw new Error("Coin ID is required")

      const response = await fetch(
        `/api/somnus-collection/${coinId}?include=deities,historical-figures`,
      )
      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `Coin fetch failed: ${response.status} ${response.statusText}`,
          errorText,
        )
        throw new Error(
          `Failed to fetch coin: ${response.status} ${response.statusText}`,
        )
      }

      const result = (await response.json()) as CoinApiResponse
      return result.data
    },
    enabled: !!coinId,
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
    isLoading: deitiesLoading || coinLoading,
    error: deitiesError ?? coinError,
    invalidateCache,
  }
}
