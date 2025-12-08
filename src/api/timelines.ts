import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Timeline, TimelineFormData } from "~/database/schema-timelines"

// Fetch all timelines
async function fetchTimelines(): Promise<Timeline[]> {
  const response = await fetch("/api/timelines")

  const result = (await response.json()) as {
    success: boolean
    data?: Timeline[]
    message?: string
  }

  if (!result.success || !result.data) {
    throw new Error(result.message ?? "Failed to fetch timelines")
  }

  return result.data
}

// Add a new timeline
async function addTimeline(data: TimelineFormData): Promise<Timeline> {
  const response = await fetch("/api/timelines/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as {
    success: boolean
    timeline?: Timeline
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to add timeline")
  }

  if (!result.timeline) {
    throw new Error("Timeline data not returned")
  }

  return result.timeline
}

// Update a timeline (admin only)
async function updateTimeline(
  id: number,
  updates: Partial<TimelineFormData>,
): Promise<Timeline> {
  const response = await fetch("/api/timelines/admin", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, updates }),
  })

  const result = (await response.json()) as {
    success: boolean
    timeline?: Timeline
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to update timeline")
  }

  if (!result.timeline) {
    throw new Error("Timeline data not returned")
  }

  return result.timeline
}

// Delete a timeline (admin only)
async function deleteTimeline(id: number): Promise<void> {
  const response = await fetch("/api/timelines/admin", {
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
    throw new Error(result.message ?? "Failed to delete timeline")
  }
}

// React Query hooks
export function useTimelines() {
  return useQuery({
    queryKey: ["timelines"],
    queryFn: fetchTimelines,
    staleTime: 5 * 60 * 1000, // 5 minutes - allow for better cache invalidation of JSONB changes
  })
}

export function useAddTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTimeline,
    onSuccess: () => {
      // Force immediate refetch of active timelines queries - ignores stale time
      void queryClient.refetchQueries({ queryKey: ["timelines"] })
      // ALSO mark as stale for future page loads
      void queryClient.invalidateQueries({ queryKey: ["timelines"] })
    },
  })
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<TimelineFormData>
    }) => updateTimeline(id, updates),
    onSuccess: async (_updatedTimeline) => {
      // Aggressive cache invalidation for JSONB changes
      // 1. Clear the entire timeline cache
      queryClient.removeQueries({ queryKey: ["timelines"] })

      // 2. Force immediate refetch from server
      await queryClient.refetchQueries({ queryKey: ["timelines"] })

      // 3. Invalidate all related queries that might show timeline data
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTimeline,
    onSuccess: async (_, _deletedId) => {
      // Aggressive cache invalidation for JSONB changes
      // 1. Clear the entire timeline cache
      queryClient.removeQueries({ queryKey: ["timelines"] })

      // 2. Force immediate refetch from server
      await queryClient.refetchQueries({ queryKey: ["timelines"] })

      // 3. Invalidate all related queries that might show timeline data
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })
    },
  })
}
