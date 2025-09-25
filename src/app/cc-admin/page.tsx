"use client";

import { useAuth } from "~/components/providers/auth-provider";
import { LoginForm } from "~/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      // Redirect to coin cabinet if already logged in
      router.push('/coin-cabinet');
    }
  }, [user, loading, router]);

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

  if (user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl">Redirecting to coin cabinet...</p>
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
            Admin Access
          </h1>
          <p className="mt-4 text-xl text-white">
            Sign in to manage your coin collection
          </p>
        </div>
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
