"use client";

import { useState } from "react";
import { CoinForm } from "~/components/forms/CoinForm";
import type { CoinFormData } from "~/lib/validations/coin-form";
import { useAuth } from "~/components/providers/auth-provider";

type ApiResponse = {
  success: boolean;
  message?: string;
};

export default function CoinCabinetPage() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFormSubmit = async (data: CoinFormData) => {
    if (!user) {
      setMessage("❌ Please log in to add coins to your collection");
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/somnus-collection/add-coin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as ApiResponse;

      if (result.success) {
        setMessage("✅ Coin added successfully to your collection!");
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage("❌ Failed to add coin to collection");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Coin Cabinet
          </h1>
          <p className="mt-4 text-xl text-white">
            {user ? "Add a new coin to your collection" : "Sign in to add coins to your collection"}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          {user ? (
            <CoinForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          ) : (
            <div className="rounded-lg bg-white/10 p-8 text-center">
              <h2 className="mb-4 text-2xl font-semibold">Authentication Required</h2>
              <p className="mb-6 text-lg">
                Please sign in to add coins to your collection.
              </p>
              <a
                href="/login"
                className="inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
              >
                Sign In
              </a>
            </div>
          )}

          {message && (
            <div className="mt-8 rounded-lg bg-white/10 p-4 text-center">
              <p className="text-lg font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
