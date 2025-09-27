"use client";

import React from "react";
import { useAuth } from "~/components/providers/auth-provider";
import { useAddFruit, useDeleteFruit, useFruits } from "~/lib/api/fruits";

type Fruit = {
  id?: number;
  fruitName: string;
  created_at?: string;
};

export default function AdminPage() {
  const [fruitName, setFruitName] = React.useState("");

  // Use auth and custom hooks
  const { user, loading } = useAuth();
  const { data: fruitData = [], isLoading, error } = useFruits();
  const addFruitMutation = useAddFruit();
  const deleteFruitMutation = useDeleteFruit();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (fruitName.trim()) {
      addFruitMutation.mutate(fruitName);
      setFruitName(""); // Clear input after submission
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Fruits
          </h1>
          {!user && (
            <p className="mt-4 text-lg text-white/80">
              Sign in to add or delete fruits
            </p>
          )}
        </div>

        {/* Add Fruit Form - Only show for authenticated users */}
        {user && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={fruitName}
              onChange={(e) => setFruitName(e.target.value)}
              placeholder="Enter a fruit name"
              disabled={addFruitMutation.isPending}
              className="mr-2 rounded border px-3 py-2 text-black placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={addFruitMutation.isPending}
              className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {addFruitMutation.isPending ? "Adding..." : "Add Fruit"}
            </button>
          </form>
        )}

        {/* Loading and Error States */}
        {isLoading && <p>Loading fruits...</p>}
        {error && <p>Error loading fruits: {error.message}</p>}

        {/* Fruits List - Show to everyone, but only show delete buttons to authenticated users */}
        <ul className="w-full max-w-md space-y-2">
          {fruitData.map((fruit: Fruit, idx: number) => (
            <li
              key={fruit.id ?? idx}
              className="flex items-center justify-between rounded bg-white/10 p-3"
            >
              <span className="text-white">{fruit.fruitName}</span>
              {/* Delete button - Only show for authenticated users */}
              {user && fruit.id && (
                <button
                  onClick={() => deleteFruitMutation.mutate(fruit.id!)}
                  disabled={deleteFruitMutation.isPending}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteFruitMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Sign in prompt for non-authenticated users */}
        {!user && fruitData.length > 0 && (
          <div className="text-center">
            <a
              href="/login"
              className="inline-block rounded bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
            >
              Sign In to Manage Fruits
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
