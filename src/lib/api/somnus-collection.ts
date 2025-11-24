import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CoinFormData } from "~/lib/validations/coin-form"
import type { SomnusCollection } from "~/server/db/schema"

// Custom React Query hooks for somnus collection
export function useSomnusCoins() {
  return useQuery({
    queryKey: ["somnus-coins"],
    queryFn: fetchSomnusCoins,
  })
}

export function useAllSomnusCoins() {
  return useQuery({
    queryKey: ["all-somnus-coins"],
    queryFn: fetchAllSomnusCoins,
  })
}

export function useAddSomnusCoin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: insertSomnusCoin,
    onSuccess: () => {
      // Invalidate and refetch all somnus coin queries after successful addition
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
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
      // Invalidate and refetch all somnus coin queries after successful update
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
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
      // Invalidate and refetch all somnus coin queries after successful deletion
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
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
  id: string
  data: Partial<SomnusCollection>
}): Promise<void> {
  const response = await fetch(`/api/somnus-collection/${params.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin", // Better for same-origin requests
    body: JSON.stringify(params.data),
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Failed to update somnus coin")
  }
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
