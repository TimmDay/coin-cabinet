import { useQuery } from "@tanstack/react-query"
import type { Artifact } from "~/database/schema-artifacts"

// Fetch all artifacts (public API for options)
async function fetchArtifacts(): Promise<Artifact[]> {
  const response = await fetch("/api/artifacts")

  if (!response.ok) {
    throw new Error("Failed to fetch artifacts")
  }

  return response.json() as Promise<Artifact[]>
}

// React Query hook
export function useArtifacts() {
  return useQuery({
    queryKey: ["artifacts"],
    queryFn: fetchArtifacts,
    staleTime: 120 * 60 * 1000, // 120 minutes - artifacts don't change very often
  })
}
