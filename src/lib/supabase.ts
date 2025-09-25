/**
 * Supabase Client Utilities
 * 
 * This file exports the appropriate Supabase client for different contexts:
 * - Client components: Use createClientComponentClient()
 * - API routes: Use createRouteHandlerClient() 
 * - Middleware: Use createMiddlewareClient()
 * 
 * Each client type is needed for proper authentication context.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest, NextResponse } from 'next/server'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

// For use in client components (React hooks, event handlers)
export function getClientComponentSupabase() {
  return createClientComponentClient()
}

// For use in API routes - requires cookies parameter
export function getRouteHandlerSupabase(cookies: () => Promise<ReadonlyRequestCookies>) {
  return createRouteHandlerClient({ cookies })
}

// For use in middleware - requires req and res parameters  
export function getMiddlewareSupabase(req: NextRequest, res: NextResponse) {
  return createMiddlewareClient({ req, res })
}

// Re-export common Supabase types for convenience
export type { User, Session } from '@supabase/auth-helpers-nextjs'
