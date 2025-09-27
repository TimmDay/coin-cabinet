import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Fruit = {
  id?: number;
  fruitName: string;
  created_at?: string;
};

// Custom React Query hooks
export function useFruits() {
  return useQuery({
    queryKey: ["fruits"],
    queryFn: fetchFruits,
  });
}

export function useAddFruit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertFruit,
    onSuccess: () => {
      // Invalidate and refetch fruits after successful addition
      void queryClient.invalidateQueries({ queryKey: ["fruits"] });
    },
    onError: (error) => {
      console.error("Error inserting fruit:", error);
    },
  });
}

export function useDeleteFruit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFruit,
    onSuccess: () => {
      // Invalidate and refetch fruits after successful deletion
      void queryClient.invalidateQueries({ queryKey: ["fruits"] });
    },
    onError: (error) => {
      console.error("Error deleting fruit:", error);
    },
  });
}

// API utility functions
async function fetchFruits(): Promise<Fruit[]> {
  const response = await fetch('/api/fruits');
  const result = await response.json() as { success: boolean; message?: string; data?: Fruit[] };

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Failed to fetch fruits');
  }

  return result.data ?? [];
}

async function insertFruit(fruitName: string): Promise<Fruit> {
  const response = await fetch('/api/fruits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fruitName }),
  });

  const result = await response.json() as { success: boolean; message?: string; data?: Fruit };

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Failed to add fruit');
  }

  return result.data!;
}

async function deleteFruit(id: number): Promise<void> {
  const response = await fetch('/api/fruits', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  const result = await response.json() as { success: boolean; message?: string };

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Failed to delete fruit');
  }
}
