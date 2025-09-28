"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../providers/auth-provider";
import { RoundButton } from "../ui/RoundButton";

export function UserMenu() {
  const { user, signOut, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Optional: Add a small delay before redirect to ensure state updates
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if there's an error, redirect to home as the local state is cleared
      window.location.href = "/";
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-sm text-slate-300 underline transition-colors hover:text-amber-300"
        >
          Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-slate-300">{user.email}</span>
      <RoundButton
        onClick={handleSignOut}
        disabled={isSigningOut}
        variant="secondary"
        size="sm"
      >
        {isSigningOut ? "Signing Out..." : "Sign Out"}
      </RoundButton>
    </div>
  );
}
