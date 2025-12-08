import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import type { CoinFormData } from "~/lib/validations/coin-form"

// Custom React Query hooks for somnus collection
export function useSomnusCoins() {
  return useQuery({
    queryKey: ["somnus-coins"],
    queryFn: fetchSomnusCoins,
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })
}

export function useAllSomnusCoins() {
  return useQuery({
    queryKey: ["all-somnus-coins"],
    queryFn: fetchAllSomnusCoins,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - coins rarely change
  })
}

export function useAddSomnusCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: insertSomnusCoin,
    onSuccess: () => {
      // Force immediate refetch of active queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["somnus-coins"] })
      void queryClient.refetchQueries({ queryKey: ["all-somnus-coins"] })
      void queryClient.refetchQueries({ queryKey: ["historical-figures"] })
      void queryClient.refetchQueries({ queryKey: ["deities"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })

      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
    },
    onError: (error) => {
      console.error("Error inserting somnus coin:", error)
    },
  })
}

export function useUpdateSomnusCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSomnusCoin,
    onSuccess: () => {
      // Aggressive cache clearing for complete data consistency
      queryClient.removeQueries({ queryKey: ["somnus-coins"] })
      queryClient.removeQueries({ queryKey: ["all-somnus-coins"] })

      // Force immediate refetch of active queries
      void queryClient.refetchQueries({ queryKey: ["somnus-coins"] })
      void queryClient.refetchQueries({ queryKey: ["all-somnus-coins"] })
      void queryClient.refetchQueries({ queryKey: ["historical-figures"] })
      void queryClient.refetchQueries({ queryKey: ["deities"] })

      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
    },
    onError: (error) => {
      console.error("Error updating somnus coin:", error)
    },
  })
}

export function useDeleteSomnusCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSomnusCoin,
    onSuccess: () => {
      // Force immediate refetch of active queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["somnus-coins"] })
      void queryClient.refetchQueries({ queryKey: ["all-somnus-coins"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })

      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
    },
    onError: (error) => {
      console.error("Error deleting somnus coin:", error)
    },
  })
}

// API utility functions
async function fetchSomnusCoins(): Promise<SomnusCollection[]> {
  const response = await fetch("/api/somnus-collection")
  const result = (await response.json()) as {
    success: boolean
    message?: string
    data?: SomnusCollection[]
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to fetch somnus coins")
  }

  return result.data ?? []
}

/**
 * Fetch all, ie for admin purposes.
 */
async function fetchAllSomnusCoins(): Promise<SomnusCollection[]> {
  const response = await fetch("/api/somnus-collection?includeAll=true")
  const result = (await response.json()) as {
    success: boolean
    message?: string
    data?: SomnusCollection[]
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to fetch all somnus coins")
  }

  return result.data ?? []
}

async function insertSomnusCoin(
  coinData: CoinFormData,
): Promise<SomnusCollection> {
  const response = await fetch("/api/somnus-collection/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coinData),
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
    coin?: SomnusCollection
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to add coin to somnus collection")
  }

  return result.coin!
}

async function updateSomnusCoin(params: {
  id: number
  data: Partial<SomnusCollection>
}): Promise<SomnusCollection> {
  const response = await fetch("/api/somnus-collection/admin", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin", // Better for same-origin requests
    body: JSON.stringify({ id: params.id, updates: params.data }),
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
    coin?: SomnusCollection
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to update somnus coin")
  }

  return result.coin!
}

async function deleteSomnusCoin(id: number): Promise<void> {
  const response = await fetch("/api/somnus-collection", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to delete somnus coin")
  }
}
