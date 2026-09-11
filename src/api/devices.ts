import { useQuery } from "@tanstack/react-query"
import type { Device } from "~/database/schema-devices"

async function fetchDevices(): Promise<Device[]> {
  const response = await fetch("/api/devices")
  const result = (await response.json()) as {
    success: boolean
    data?: Device[]
    message?: string
  }
  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch devices")
  }
  return result.data
}

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })
}
