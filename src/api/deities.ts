import { useQuery } from "@tanstack/react-query"
import type { Deity } from "~/database/schema-deities"

// Fetch all deities
async function fetchDeities(): Promise<Deity[]> {
  const response = await fetch("/api/deities")

  const result = (await response.json()) as {
    success: boolean
    data?: Deity[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch deities")
  }

  return result.data
}

export function useDeities() {
  return useQuery({
    queryKey: ["deities"],
    queryFn: fetchDeities,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - deities rarely change
  })
}
