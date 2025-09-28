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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <p className="coin-description text-xl">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-200 sm:text-6xl">
            Admin <span className="heading-accent">Panel</span>
          </h1>
          <p className="coin-description mt-4 text-xl">
            Manage fruits collection
          </p>
          {!user && (
            <p className="coin-description mt-2">
              Sign in to add or delete fruits
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Add Fruit Form - Only show for authenticated users */}
          {user && (
            <div className="artemis-card p-6">
              <h2 className="coin-title mb-4 text-xl">Add New Fruit</h2>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={fruitName}
                  onChange={(e) => setFruitName(e.target.value)}
                  placeholder="Enter a fruit name"
                  disabled={addFruitMutation.isPending}
                  className="flex-1 rounded border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-200 placeholder-slate-400 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={addFruitMutation.isPending}
                  className="artemis-button px-4 py-2 disabled:opacity-50"
                >
                  {addFruitMutation.isPending ? "Adding..." : "Add Fruit"}
                </button>
              </form>
            </div>
          )}

          {/* Loading and Error States */}
          {isLoading && <p className="coin-description">Loading fruits...</p>}
          {error && (
            <p className="text-red-400">
              Error loading fruits: {error.message}
            </p>
          )}

          {/* Fruits List - Show to everyone, but only show delete buttons to authenticated users */}
          {fruitData.length > 0 && (
            <div className="artemis-card w-full max-w-md p-6">
              <h2 className="coin-title mb-4 text-xl">Fruits Collection</h2>
              <ul className="space-y-2">
                {fruitData.map((fruit: Fruit, idx: number) => (
                  <li
                    key={fruit.id ?? idx}
                    className="flex items-center justify-between rounded border border-slate-600/50 bg-slate-800/30 p-3"
                  >
                    <span className="text-slate-200">{fruit.fruitName}</span>
                    {/* Delete button - Only show for authenticated users */}
                    {user && fruit.id && (
                      <button
                        onClick={() => deleteFruitMutation.mutate(fruit.id!)}
                        disabled={deleteFruitMutation.isPending}
                        className="rounded border border-rose-700/50 bg-rose-800/60 px-3 py-1 text-sm text-rose-100 transition-colors hover:bg-rose-700/60 disabled:opacity-50"
                      >
                        {deleteFruitMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sign in prompt for non-authenticated users */}
          {!user && fruitData.length > 0 && (
            <div className="text-center">
              <a
                href="/login"
                className="artemis-button inline-block px-6 py-3 transition-colors"
              >
                Sign In to Manage Fruits
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
