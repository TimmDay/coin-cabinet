"use client"

import { useArtifacts } from "~/api/artifacts"

export function useArtifactOptions() {
  const { data: artifacts, isLoading, error } = useArtifacts()

  const options =
    artifacts?.map((artifact) => ({
      value: artifact.id,
      label: artifact.name,
    })) ?? []

  return {
    options,
    isLoading,
    error,
  }
}
