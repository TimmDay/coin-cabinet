/**
 * Supabase Client Utilities
 *
 * This file exports the appropriate Supabase client for different contexts:
 * - Client components: Use createBrowserClient()
 * - Public access: Use createPublicClient()
 * - Middleware: Use createMiddlewareClient()
 *
 * For server-side clients, import createServerClient from server-only files.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton instance for browser client to prevent multiple instances
let browserClient: ReturnType<typeof createClient> | null = null;

// Client-side Supabase client (for browser/React components)
export const createBrowserClient = () => {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  return browserClient;
};

// Public Supabase client (no authentication, for public data access)
export const createPublicClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Middleware Supabase client (for Next.js middleware with custom cookie handling)
export const createMiddlewareClient = (cookieString: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      headers: {
        cookie: cookieString,
      },
    },
  });
};

// Legacy function for backward compatibility
export const getBrowserSupabase = createBrowserClient;

// Re-export common Supabase types for convenience
export type { Session, User } from "@supabase/supabase-js";
