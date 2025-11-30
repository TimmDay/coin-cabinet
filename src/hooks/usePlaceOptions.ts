"use client"

import { usePlaces } from "~/api/places"

export function usePlaceOptions() {
  const { data: places, isLoading, error } = usePlaces()

  const options =
    places?.map((place) => ({
      value: place.id.toString(),
      label: place.name,
    })) ?? []

  return {
    options,
    isLoading,
    error,
  }
}
