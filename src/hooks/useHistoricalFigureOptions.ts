"use client"

import { useHistoricalFigures } from "~/api/historical-figures"

export function useHistoricalFigureOptions() {
  const { data: historicalFigures, isLoading, error } = useHistoricalFigures()

  const options =
    historicalFigures?.map((figure) => ({
      value: figure.id.toString(),
      label: figure.name,
    })) ?? []

  return {
    options,
    isLoading,
    error,
  }
}
