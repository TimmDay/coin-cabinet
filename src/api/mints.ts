import { useQuery } from "@tanstack/react-query"
import type { Mint } from "~/database/schema-mints"

// Fetch all mints
async function fetchMints(): Promise<Mint[]> {
  const response = await fetch("/api/mints")

  const result = (await response.json()) as {
    success: boolean
    data?: Mint[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch mints")
  }

  return result.data
}

export function useMints() {
  return useQuery({
    queryKey: ["mints"],
    queryFn: fetchMints,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}
