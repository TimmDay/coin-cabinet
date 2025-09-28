"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "~/components/auth/LoginForm";
import { useAuth } from "~/components/providers/auth-provider";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      // Redirect to admin if already logged in
      router.push("/admin");
    }
  }, [user, loading, router]);

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

  if (user) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="coin-description text-xl">Redirecting to admin...</p>
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
            Sign <span className="heading-accent">In</span>
          </h1>
          <p className="coin-description mt-4 text-xl">
            Sign in to manage your collection
          </p>
        </div>
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
