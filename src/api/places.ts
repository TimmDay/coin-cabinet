"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Place } from "~/database/schema-places"
import type { PlaceFormData } from "~/lib/validations/place-form"

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

// Add a new place
async function addPlace(data: PlaceFormData): Promise<Place> {
  const response = await fetch("/api/places/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as {
    success: boolean
    place?: Place
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to add place")
  }

  if (!result.place) {
    throw new Error("Place data not returned")
  }

  return result.place
}

// Update a place
async function updatePlace(
  id: number,
  updates: Partial<PlaceFormData>,
): Promise<Place> {
  const response = await fetch(`/api/places/admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updates }),
  })

  const result = (await response.json()) as {
    success: boolean
    place?: Place
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to update place")
  }

  if (!result.place) {
    throw new Error("Updated place data not returned")
  }

  return result.place
}

// React Query Hooks
export function usePlaces() {
  return useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
}

export function useAddPlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addPlace,
    onSuccess: () => {
      // Force immediate refetch of places list
      void queryClient.refetchQueries({ queryKey: ["places"] })
    },
  })
}

export function useUpdatePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<PlaceFormData>
    }) => updatePlace(id, updates),
    onSuccess: () => {
      // Force immediate refetch of places list
      void queryClient.refetchQueries({ queryKey: ["places"] })

      // Invalidate any related queries that might include place data
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
    },
  })
}
