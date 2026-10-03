import type { SupabaseClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "~/database/database.types"
import type { QueryResult } from "~/database/queries/types"
import { createClient } from "~/database/supabase-server"

/**
 * Thrown from a route's loader for a failure the visitor may be told about
 * (a bad id, say). Anything else that goes wrong is logged and answered with a
 * fixed message, so database errors never reach the client.
 */
export class PublicRouteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

type PublicRouteOptions = {
  /** Let browsers and the CDN keep a successful response. */
  cache?: boolean
}

const NO_STORE = "no-cache, no-store, must-revalidate"

/**
 * A public (anon, read-only) GET route: gets the Supabase client, runs the
 * loader and answers `{ success, data }`. A loader that returns `data: null`
 * answers 404. Failures log the cause and answer a fixed message, with the
 * cause attached outside production only.
 */
export function publicRoute<T, Context = unknown>(
  label: string,
  load: (
    supabase: SupabaseClient<Database>,
    context: Context,
  ) => Promise<QueryResult<T | null>>,
  { cache = false }: PublicRouteOptions = {},
) {
  return async (_request: Request, context: Context) => {
    try {
      const supabase = await createClient()
      const { data, error } = await load(supabase, context)

      if (error) throw new Error(error.message)

      if (data === null) {
        return NextResponse.json(
          { success: false, message: `${label} not found` },
          { status: 404, headers: { "Cache-Control": NO_STORE } },
        )
      }

      return NextResponse.json(
        { success: true, data },
        {
          headers: cache
            ? {
                "Cache-Control":
                  "public, max-age=300, stale-while-revalidate=86400",
                "CDN-Cache-Control": "public, max-age=86400",
              }
            : undefined,
        },
      )
    } catch (error) {
      if (error instanceof PublicRouteError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.status, headers: { "Cache-Control": NO_STORE } },
        )
      }

      console.error(`GET ${label} failed:`, error)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to load ${label}`,
          ...(process.env.NODE_ENV !== "production" && {
            error: error instanceof Error ? error.message : String(error),
          }),
        },
        { status: 500, headers: { "Cache-Control": NO_STORE } },
      )
    }
  }
}
