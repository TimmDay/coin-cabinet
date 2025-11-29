"use client"

import { useDeities } from "~/api/deities"

export function useDeityOptions() {
  const { data: deities, isLoading, error } = useDeities()

  const options =
    deities?.map((deity) => ({
      value: deity.id.toString(),
      label: deity.name,
    })) ?? []

  return {
    options,
    isLoading,
    error,
  }
}
