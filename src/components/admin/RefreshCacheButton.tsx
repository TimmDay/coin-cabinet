"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

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

async function fetchFreshCoins() {
  const response = await fetch(`/api/somnus-collection?t=${Date.now()}`, {
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
        const freshCoins = await fetchFreshCoins()
        queryClient.setQueryData(["all-somnus-coins"], freshCoins)
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

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      onClick={handleRefreshCache}
      disabled={isRefreshing}
      className={`rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${className}`}
    >
      {isRefreshing ? "Refreshing..." : "Refresh Cache"}
    </button>
  )
}
