import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Device } from "~/database/schema-devices"
import type { DeviceFormData } from "~/lib/validations/device-form"

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

async function addDevice(data: DeviceFormData): Promise<void> {
  const response = await fetch("/api/devices/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = (await response.json()) as {
    success: boolean
    message?: string
  }
  if (!result.success) throw new Error(result.message ?? "Failed to add device")
}

async function updateDevice(
  id: string,
  updates: Partial<DeviceFormData>,
): Promise<void> {
  const response = await fetch("/api/devices/admin", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, updates }),
  })
  const result = (await response.json()) as {
    success: boolean
    message?: string
  }
  if (!result.success)
    throw new Error(result.message ?? "Failed to update device")
}

async function deleteDevice(id: string): Promise<void> {
  const response = await fetch("/api/devices/admin", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  const result = (await response.json()) as {
    success: boolean
    message?: string
  }
  if (!result.success)
    throw new Error(result.message ?? "Failed to delete device")
}

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: fetchDevices,
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })
}

export function useAddDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addDevice,
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["devices"] })
      void queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<DeviceFormData>
    }) => updateDevice(id, updates),
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["devices"] })
      void queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDevice,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["devices"] })
      const previousDevices = queryClient.getQueryData<Device[]>(["devices"])
      if (previousDevices) {
        queryClient.setQueryData<Device[]>(
          ["devices"],
          (old) => old?.filter((d) => d.id !== deletedId) ?? [],
        )
      }
      return { previousDevices }
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousDevices) {
        queryClient.setQueryData(["devices"], context.previousDevices)
      }
    },
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["devices"] })
      void queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })
}
