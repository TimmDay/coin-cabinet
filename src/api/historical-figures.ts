import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

// Add a new historical figure
async function addHistoricalFigure(
  data: Omit<HistoricalFigure, "id" | "created_at" | "updated_at" | "user_id">,
): Promise<HistoricalFigure> {
  const response = await fetch("/api/historical-figures/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as {
    success: boolean
    data?: HistoricalFigure
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to add historical figure")
  }

  return result.data
}

// Update a historical figure
async function updateHistoricalFigure(
  id: number,
  data: Partial<
    Omit<HistoricalFigure, "id" | "created_at" | "updated_at" | "user_id">
  >,
): Promise<HistoricalFigure> {
  const response = await fetch(`/api/historical-figures/admin/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as {
    success: boolean
    data?: HistoricalFigure
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to update historical figure")
  }

  return result.data
}

// Delete a historical figure
async function deleteHistoricalFigure(id: number): Promise<void> {
  const response = await fetch(`/api/historical-figures/admin/${id}`, {
    method: "DELETE",
  })

  const result = (await response.json()) as {
    success: boolean
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to delete historical figure")
  }
}

// React Query Hooks
export const useHistoricalFigures = () => {
  return useQuery({
    queryKey: ["historical-figures"],
    queryFn: fetchHistoricalFigures,
  })
}

export const useAddHistoricalFigure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addHistoricalFigure,
    onSuccess: () => {
      // Force immediate refetch of active queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["historical-figures"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["historical-figures"] })

      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}

export const useUpdateHistoricalFigure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<
        Omit<HistoricalFigure, "id" | "created_at" | "updated_at" | "user_id">
      >
    }) => updateHistoricalFigure(id, data),
    onSuccess: () => {
      // Force immediate refetch of active queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["historical-figures"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["historical-figures"] })

      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}

export const useDeleteHistoricalFigure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHistoricalFigure,
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["historical-figures"] })

      // Snapshot the previous value
      const previousFigures = queryClient.getQueryData<HistoricalFigure[]>([
        "historical-figures",
      ])

      // Optimistically update to the new value
      if (previousFigures) {
        queryClient.setQueryData<HistoricalFigure[]>(
          ["historical-figures"],
          (old) => old?.filter((figure) => figure.id !== deletedId) ?? [],
        )
      }

      return { previousFigures }
    },
    onError: (err, deletedId, context) => {
      // Roll back on error
      if (context?.previousFigures) {
        queryClient.setQueryData(
          ["historical-figures"],
          context.previousFigures,
        )
      }
    },
    onSuccess: () => {
      // Force immediate refetch of active queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["historical-figures"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["historical-figures"] })

      // Invalidate related queries
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}
