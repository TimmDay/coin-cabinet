/**
 * Server-only Supabase Client Utilities
 *
 * This file contains server-side Supabase clients that use next/headers.
 * Only import this in server components and API routes.
 */

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side Supabase client (for API routes and server components with auth)
export const createServerClient = async () => {
  const cookieStore = await cookies();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
};
