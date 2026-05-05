"use client"

import { useDevices } from "~/api/devices"

export function useDeviceOptions() {
  const { data: devices, isLoading, error } = useDevices()

  const options =
    devices?.map((device) => ({
      value: device.id,
      label: device.name,
    })) ?? []

  return {
    options,
    isLoading,
    error,
  }
}
