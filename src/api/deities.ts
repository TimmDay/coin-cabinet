import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Deity } from "~/database/schema-deities"
import type { DeityFormData } from "~/lib/validations/deity-form"

// Fetch all deities
async function fetchDeities(): Promise<Deity[]> {
  const response = await fetch("/api/deities")

  const result = (await response.json()) as {
    success: boolean
    data?: Deity[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch deities")
  }

  return result.data
}

// Add a new deity
async function addDeity(data: DeityFormData): Promise<Deity> {
  const response = await fetch("/api/deities/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as {
    success: boolean
    deity?: Deity
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to add deity")
  }

  if (!result.deity) {
    throw new Error("Deity data not returned")
  }

  return result.deity
}

// Update a deity (admin only)
async function updateDeity(
  id: number,
  updates: Partial<DeityFormData>,
): Promise<Deity> {
  const response = await fetch("/api/deities/admin", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, updates }),
  })

  const result = (await response.json()) as {
    success: boolean
    deity?: Deity
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to update deity")
  }

  if (!result.deity) {
    throw new Error("Deity data not returned")
  }

  return result.deity
}

// Delete a deity (admin only)
async function deleteDeity(id: number): Promise<void> {
  const response = await fetch("/api/deities/admin", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to delete deity")
  }
}

// React Query hooks
export function useDeities() {
  return useQuery({
    queryKey: ["deities"],
    queryFn: fetchDeities,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days - deities rarely change
  })
}

export function useAddDeity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addDeity,
    onSuccess: () => {
      // Force immediate refetch of active deities queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["deities"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["deities"] })

      // Invalidate related queries (these can wait for next access)
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}
export function useUpdateDeity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<DeityFormData>
    }) => updateDeity(id, updates),
    onSuccess: () => {
      // Force immediate refetch of active deities queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["deities"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["deities"] })

      // Invalidate related queries (these can wait for next access)
      void queryClient.invalidateQueries({
        queryKey: ["specific-coin-with-deities"],
      })
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}

export function useDeleteDeity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeity,
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["deities"] })

      // Snapshot the previous value
      const previousDeities = queryClient.getQueryData<Deity[]>(["deities"])

      // Optimistically update to the new value
      if (previousDeities) {
        queryClient.setQueryData<Deity[]>(
          ["deities"],
          (old) => old?.filter((deity) => deity.id !== deletedId) ?? [],
        )
      }

      return { previousDeities }
    },
    onError: (err, deletedId, context) => {
      // Roll back on error
      if (context?.previousDeities) {
        queryClient.setQueryData(["deities"], context.previousDeities)
      }
    },
    onSuccess: () => {
      // Force immediate refetch of active deities queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["deities"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["deities"] })

      // Invalidate related queries (these can wait for next access)
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}
