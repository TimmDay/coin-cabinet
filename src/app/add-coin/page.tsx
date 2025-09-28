"use client";

import { useState } from "react";
import { CoinForm } from "~/components/forms/CoinForm";
import { useAuth } from "~/components/providers/auth-provider";
import type { CoinFormData } from "~/lib/validations/coin-form";

type ApiResponse = {
  success: boolean;
  message?: string;
};

export default function AddCoinPage() {
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
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as ApiResponse;

      if (result.success) {
        setMessage("✅ Somnus accepts your offering");
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
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="coin-description text-xl">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-200 sm:text-6xl">
            Add <span className="text-auth-accent">Coin</span>
          </h1>
          <p className="coin-description mt-4 text-xl">
            {user
              ? "Add a new coin to your collection"
              : "Sign in to add coins to your collection"}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          {user ? (
            <CoinForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          ) : (
            <div className="artemis-card p-8 text-center">
              <h2 className="coin-title mb-4 text-2xl font-semibold">
                Authentication Required
              </h2>
              <p className="coin-description mb-6 text-lg">
                Please sign in to add coins to your collection.
              </p>
              <a
                href="/login"
                className="artemis-button inline-block px-6 py-3 transition-colors"
              >
                Sign In
              </a>
            </div>
          )}

          {message && (
            <div className="artemis-card mt-8 p-4 text-center">
              <p className="text-lg font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
