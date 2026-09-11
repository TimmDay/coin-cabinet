import { useQuery } from "@tanstack/react-query"
import type { HistoricalFigure } from "~/database/schema-historical-figures"

// Fetch all historical figures
async function fetchHistoricalFigures(): Promise<HistoricalFigure[]> {
  const response = await fetch("/api/historical-figures")

  const result = (await response.json()) as {
    success: boolean
    data?: HistoricalFigure[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch historical figures")
  }

  return result.data
}

export const useHistoricalFigures = () => {
  return useQuery({
    queryKey: ["historical-figures"],
    queryFn: fetchHistoricalFigures,
  })
}
