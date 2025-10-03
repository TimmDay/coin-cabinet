"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "~/components/auth/LoginForm";
import { useAuth } from "~/components/providers/auth-provider";
import { PageTitle } from "~/components/ui/PageTitle";

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
          <PageTitle authPage className="mb-6">
            Sign In
          </PageTitle>
          <p className="coin-description text-xl">
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
