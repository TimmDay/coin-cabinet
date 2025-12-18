"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "~/components/ui/Button"
import { useFeatureFlag } from "~/lib/hooks/useFeatureFlag"

type RefreshCacheButtonProps = {
  onMessage?: (message: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}

// Cache-busting fetch functions for all data types
async function fetchFreshTimelines() {
  const response = await fetch(`/api/timelines?t=${Date.now()}`, {
    cache: "no-cache",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  })
  const result = (await response.json()) as ApiResponse<unknown[]>
  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch timelines")
  }
  return result.data
}

async function fetchFreshCoins(showHidden = false) {
  const params = new URLSearchParams({ t: Date.now().toString() })
  if (showHidden) params.set("showHidden", "true")

  const response = await fetch(`/api/somnus-collection?${params.toString()}`, {
    cache: "no-cache",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  })
  const result = (await response.json()) as ApiResponse<unknown[]>
  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch coins")
  }
  return result.data
}

async function fetchFreshHistoricalFigures() {
  const response = await fetch(`/api/historical-figures?t=${Date.now()}`, {
    cache: "no-cache",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  })
  const result = (await response.json()) as ApiResponse<unknown[]>
  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch historical figures")
  }
  return result.data
}

async function fetchFreshDeities() {
  const response = await fetch(`/api/deities?t=${Date.now()}`, {
    cache: "no-cache",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  })
  const result = (await response.json()) as ApiResponse<unknown[]>
  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch deities")
  }
  return result.data
}

export function RefreshCacheButton({
  onMessage,
  className = "",
  size = "md",
}: RefreshCacheButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const queryClient = useQueryClient()
  const showHidden = useFeatureFlag("show-hidden-coins")

  const handleRefreshCache = async () => {
    setIsRefreshing(true)
    try {
      console.log("🔄 Universal cache refresh started")

      // 1. Remove all cached data
      queryClient.removeQueries({ queryKey: ["timelines"] })
      queryClient.removeQueries({ queryKey: ["coin"] })
      queryClient.removeQueries({ queryKey: ["somnus-coins"] })
      queryClient.removeQueries({ queryKey: ["all-somnus-coins"] })
      queryClient.removeQueries({ queryKey: ["historical-figures"] })
      queryClient.removeQueries({ queryKey: ["deities"] })

      // 2. Invalidate all other queries
      await queryClient.invalidateQueries()

      // 3. Fetch fresh data with cache busting and update cache
      try {
        const freshTimelines = await fetchFreshTimelines()
        queryClient.setQueryData(["timelines"], freshTimelines)
        console.log("✅ Timelines refreshed")
      } catch (error) {
        console.warn("⚠️ Could not refresh timelines:", error)
      }

      try {
        const freshCoins = await fetchFreshCoins(showHidden)
        // Update both query keys to maintain consistency
        queryClient.setQueryData(["all-somnus-coins"], freshCoins)
        queryClient.setQueryData(["somnus-coins", showHidden], freshCoins)
        console.log("✅ Coins refreshed")
      } catch (error) {
        console.warn("⚠️ Could not refresh coins:", error)
      }

      try {
        const freshHistoricalFigures = await fetchFreshHistoricalFigures()
        queryClient.setQueryData(["historical-figures"], freshHistoricalFigures)
        console.log("✅ Historical figures refreshed")
      } catch (error) {
        console.warn("⚠️ Could not refresh historical figures:", error)
      }

      try {
        const freshDeities = await fetchFreshDeities()
        queryClient.setQueryData(["deities"], freshDeities)
        console.log("✅ Deities refreshed")
      } catch (error) {
        console.warn("⚠️ Could not refresh deities:", error)
      }

      // 4. Force refetch any remaining queries
      await queryClient.refetchQueries({
        exact: false,
        stale: true,
      })

      console.log("✅ Universal cache refresh completed")
      onMessage?.("✅ Cache refreshed successfully")
    } catch (error) {
      console.error("Error refreshing cache:", error)
      onMessage?.("❌ Failed to refresh cache")
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      onClick={handleRefreshCache}
      isLoading={isRefreshing}
      loadingText="Refreshing..."
      size={size}
      className={className}
    >
      Refresh Cache
    </Button>
  )
}
