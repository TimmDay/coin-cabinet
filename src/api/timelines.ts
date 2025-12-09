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
    onSuccess: async (updatedTimeline) => {
      // Extra aggressive cache invalidation for JSONB changes on mobile
      // 1. Clear ALL queries first to force fresh data
      queryClient.clear()

      // 2. Force immediate refetch of timelines from server
      await queryClient.refetchQueries({
        queryKey: ["timelines"],
        type: "active",
      })

      // 3. Set the updated timeline data directly in cache to ensure immediate UI update
      queryClient.setQueryData(
        ["timelines"],
        (oldData: Timeline[] | undefined) => {
          if (!oldData) return [updatedTimeline]
          return oldData.map((t) =>
            t.id === updatedTimeline.id ? updatedTimeline : t,
          )
        },
      )

      // 4. Invalidate all related queries that might show timeline data
      void queryClient.invalidateQueries({ queryKey: ["coin"] })
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] })
      void queryClient.invalidateQueries({ queryKey: ["all-somnus-coins"] })

      // 5. Force a hard refresh of the page data (mobile-specific)
      if (
        typeof window !== "undefined" &&
        /Mobi|Android/i.test(navigator.userAgent)
      ) {
        // On mobile, also force a slight delay to ensure state propagates
        setTimeout(() => {
          void queryClient.refetchQueries({ queryKey: ["timelines"] })
        }, 100)
      }
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
