"use client"

import { useQuery } from "@tanstack/react-query"

type Envelope<T> = { success: boolean; data?: T; message?: string }

/** A failed public fetch, with the HTTP status so callers can tell 404 apart. */
export class PublicFetchError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

/**
 * GET a public route and unwrap its `{ success, data }` envelope. Throws an
 * Error carrying the route's message, so a hook's `error` is always readable.
 */
export async function fetchPublic<T>(path: string, label: string): Promise<T> {
  const response = await fetch(path)

  let result: Envelope<T> | null = null
  try {
    result = (await response.json()) as Envelope<T>
  } catch {
    // Not JSON (a gateway error page, say): fall through to the message below.
  }

  if (!response.ok || !result?.success || result.data === undefined) {
    throw new PublicFetchError(
      result?.message ?? `Failed to load ${label}`,
      response.status,
    )
  }

  return result.data
}

type PublicQueryConfig = {
  key: readonly string[]
  path: string
  /** Plain name for error messages, e.g. "mints". */
  label: string
  staleTime: number
}

const MINUTE = 60 * 1000
export const STALE = {
  fiveMinutes: 5 * MINUTE,
  twoHours: 120 * MINUTE,
  week: 7 * 24 * 60 * MINUTE,
} as const

/** Build the React Query hook for one public list route. */
export function createPublicQuery<T>({
  key,
  path,
  label,
  staleTime,
}: PublicQueryConfig) {
  /**
   * `enabled: false` holds the request until a caller actually wants the data,
   * so a layer nobody has switched on costs nothing to fetch.
   */
  return function usePublicQuery(options?: { enabled?: boolean }) {
    return useQuery({
      queryKey: key,
      queryFn: () => fetchPublic<T>(path, label),
      staleTime,
      enabled: options?.enabled ?? true,
    })
  }
}
