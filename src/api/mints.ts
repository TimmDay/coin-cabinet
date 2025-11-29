import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Mint } from "~/database/schema-mints"
import type { MintFormData } from "~/lib/validations/mint-form"

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

// Add a new mint
async function addMint(data: MintFormData): Promise<Mint> {
  const response = await fetch("/api/mints/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as {
    success: boolean
    mint?: Mint
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to add mint")
  }

  if (!result.mint) {
    throw new Error("Mint data not returned")
  }

  return result.mint
}

// Update a mint (admin only)
async function updateMint(
  id: number,
  updates: Partial<MintFormData>,
): Promise<Mint> {
  const response = await fetch("/api/mints/admin", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, updates }),
  })

  const result = (await response.json()) as {
    success: boolean
    mint?: Mint
    message?: string
  }

  if (!result.success) {
    throw new Error(result.message ?? "Failed to update mint")
  }

  if (!result.mint) {
    throw new Error("Mint data not returned")
  }

  return result.mint
}

// Delete a mint (admin only)
async function deleteMint(id: number): Promise<void> {
  const response = await fetch("/api/mints/admin", {
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
    throw new Error(result.message ?? "Failed to delete mint")
  }
}

// React Query hooks
export function useMints() {
  return useQuery({
    queryKey: ["mints"],
    queryFn: fetchMints,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

export function useAddMint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addMint,
    onSuccess: () => {
      // Invalidate and refetch mints list
      void queryClient.invalidateQueries({ queryKey: ["mints"] })
    },
  })
}

export function useUpdateMint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<MintFormData>
    }) => updateMint(id, updates),
    onSuccess: () => {
      // Invalidate and refetch mints list
      void queryClient.invalidateQueries({ queryKey: ["mints"] })
    },
  })
}

export function useDeleteMint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMint,
    onSuccess: () => {
      // Invalidate and refetch mints list
      void queryClient.invalidateQueries({ queryKey: ["mints"] })
    },
  })
}
