"use client"

import { useQuery } from "@tanstack/react-query"

type Envelope<T> = { success: boolean; data?: T; message?: string }

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
    throw new Error(result?.message ?? `Failed to load ${label}`)
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
  return function usePublicQuery() {
    return useQuery({
      queryKey: key,
      queryFn: () => fetchPublic<T>(path, label),
      staleTime,
    })
  }
}
