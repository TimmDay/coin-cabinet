import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SomnusCollection, NewSomnusCollection } from "~/server/db/schema";

// Custom React Query hooks for somnus collection
export function useSomnusCoins() {
  return useQuery({
    queryKey: ["somnus-coins"],
    queryFn: fetchSomnusCoins,
  });
}

export function useAddSomnusCoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertSomnusCoin,
    onSuccess: () => {
      // Invalidate and refetch somnus coins after successful addition
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] });
    },
    onError: (error) => {
      console.error("Error inserting somnus coin:", error);
    },
  });
}

export function useDeleteSomnusCoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSomnusCoin,
    onSuccess: () => {
      // Invalidate and refetch somnus coins after successful deletion
      void queryClient.invalidateQueries({ queryKey: ["somnus-coins"] });
    },
    onError: (error) => {
      console.error("Error deleting somnus coin:", error);
    },
  });
}

// API utility functions
async function fetchSomnusCoins(): Promise<SomnusCollection[]> {
  const response = await fetch('/api/somnus-collection');
  const result = await response.json() as { success: boolean; message?: string; data?: SomnusCollection[] };

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Failed to fetch somnus coins');
  }

  return result.data ?? [];
}

async function insertSomnusCoin(coinData: NewSomnusCollection): Promise<SomnusCollection> {
  const response = await fetch('/api/somnus-collection/add-coin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(coinData),
  });

  const result = await response.json() as { success: boolean; message?: string; coin?: SomnusCollection };

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Failed to add coin to somnus collection');
  }

  return result.coin!;
}

async function deleteSomnusCoin(id: number): Promise<void> {
  const response = await fetch('/api/somnus-collection', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  const result = await response.json() as { success: boolean; message?: string };

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Failed to delete somnus coin');
  }
}
