"use client"

import { useQuery } from "@tanstack/react-query"
import type { Place } from "~/database/schema-places"

// Fetch all places
async function fetchPlaces(): Promise<Place[]> {
  const response = await fetch("/api/places")

  const result = (await response.json()) as {
    success: boolean
    data?: Place[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch places")
  }

  return result.data
}

export function usePlaces() {
  return useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })
}
