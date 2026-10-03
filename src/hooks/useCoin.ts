"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPublic, PublicFetchError } from "~/api/public-query"
import type { CoinEnhanced } from "~/types/api"

/** One coin for its deep dive page. `notFound` is a 404, not a failure. */
export function useCoin(coinId: number | null) {
  const valid = coinId !== null && Number.isInteger(coinId) && coinId > 0

  const { data, isLoading, error } = useQuery({
    queryKey: ["coin", coinId],
    queryFn: () =>
      fetchPublic<CoinEnhanced>(`/api/somnus-collection/${coinId}`, "coin"),
    enabled: valid,
    staleTime: 2 * 60 * 1000,
    // A missing coin will not appear on a retry.
    retry: (count, err) =>
      !(err instanceof PublicFetchError && err.status === 404) && count < 3,
  })

  const notFound = error instanceof PublicFetchError && error.status === 404

  return {
    coin: data ?? null,
    isLoading: valid && isLoading,
    notFound: notFound || !valid,
    error: notFound ? null : error,
  }
}
