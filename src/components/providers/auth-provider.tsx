"use client";

import type { AuthError, Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "~/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Use useMemo to ensure the Supabase client is only created once
  const supabase = useMemo(() => getBrowserSupabase(), []);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    void getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Attempt to sign out normally
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('Sign out API call failed:', error);
        
        // If it's a session_not_found error, we can safely ignore it
        // as it means the user is already signed out on the server
        if (error.message?.includes('session_not_found') || error.message?.includes('Session from session_id claim in JWT does not exist')) {
          console.log('Session already invalid on server, proceeding with local cleanup');
        } else {
          console.error('Unexpected sign out error:', error);
        }
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      // Always clear local state regardless of API call success
      // This ensures the user is signed out from the UI perspective
      setSession(null);
      setUser(null);
      
      // Force clear any remaining session data from localStorage
      if (typeof window !== 'undefined') {
        // Clear Supabase session data
        Object.keys(window.localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.includes('auth')) {
            window.localStorage.removeItem(key);
          }
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
