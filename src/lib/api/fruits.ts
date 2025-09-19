import { supabase } from "~/supabase-client";
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

// Supabase utility functions
async function fetchFruits(): Promise<Fruit[]> {
  const { data, error } = await supabase
    .from("Test")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch fruits: ${error.message}`);
  }

  return (data as Fruit[]) || [];
}

async function insertFruit(fruitName: string): Promise<Fruit> {
  const result = await supabase
    .from("Test")
    .insert([{ fruitName }])
    .select()
    .single();

  if (result.error) {
    throw new Error(`Failed to insert fruit: ${result.error.message}`);
  }

  return result.data as Fruit;
}

async function deleteFruit(id: number): Promise<void> {
  const { error } = await supabase.from("Test").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete fruit: ${error.message}`);
  }
}
