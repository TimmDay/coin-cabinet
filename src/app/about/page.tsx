"use client";

import React from "react";
import { useFruits, useAddFruit, useDeleteFruit } from "~/lib/api/fruits";

interface Fruit {
  id?: number;
  fruitName: string;
  created_at?: string;
}

export default function AboutPage() {
  const [fruitName, setFruitName] = React.useState("");

  // Use custom hooks
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          About
        </h1>
        <p className="text-xl text-white">This is the about page.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={fruitName}
            onChange={(e) => setFruitName(e.target.value)}
            placeholder="Enter a fruit name"
            disabled={addFruitMutation.isPending}
            className="mr-2 rounded border px-3 py-2 text-white"
          />
          <button
            type="submit"
            disabled={addFruitMutation.isPending}
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {addFruitMutation.isPending ? "Adding..." : "Submit"}
          </button>
        </form>

        {isLoading && <p>Loading fruits...</p>}
        {error && <p>Error loading fruits: {error.message}</p>}

        {/* A list of each piece of the fetched fruit data, the object key "fruitName" */}
        <ul className="w-full max-w-md space-y-2">
          {fruitData.map((fruit: Fruit, idx: number) => (
            <li key={fruit.id ?? idx} className="flex items-center justify-between rounded bg-white/10 p-3">
              <span className="text-white">{fruit.fruitName}</span>
              {fruit.id && (
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
      </div>
    </main>
  );
}
