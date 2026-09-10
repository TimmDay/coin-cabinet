import { useQuery } from "@tanstack/react-query"
import type { Timeline } from "~/database/schema-timelines"

// Fetch all timelines
async function fetchTimelines(): Promise<Timeline[]> {
  const response = await fetch("/api/timelines")

  const result = (await response.json()) as {
    success: boolean
    data?: Timeline[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch timelines")
  }

  return result.data
}

export function useTimelines() {
  return useQuery({
    queryKey: ["timelines"],
    queryFn: fetchTimelines,
    staleTime: 5 * 60 * 1000, // 5 minutes - allow for better cache invalidation of JSONB changes
  })
}
