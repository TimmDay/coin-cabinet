import { useQuery } from "@tanstack/react-query"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import { useFeatureFlag } from "~/lib/hooks/useFeatureFlag"

// Custom React Query hooks for somnus collection
export function useSomnusCoins() {
  const showHidden = useFeatureFlag("show-hidden-coins")

  return useQuery({
    queryKey: ["somnus-coins", showHidden],
    queryFn: () => fetchSomnusCoins(showHidden),
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })
}

// API utility functions
async function fetchSomnusCoins(
  showHidden = false,
): Promise<SomnusCollection[]> {
  const params = new URLSearchParams()
  if (showHidden) params.set("showHidden", "true")

  const response = await fetch(`/api/somnus-collection?${params.toString()}`)
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
