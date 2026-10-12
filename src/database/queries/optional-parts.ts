type Lookup<T> = { data: T | null; error: { message: string } | null }

/**
 * For a read with a main part and optional extras (citations, device names,
 * place labels). An extra that fails is logged and left empty, so the main data
 * still loads, and the read is marked partial so the response is not cached and
 * the missing extras come back on the next request.
 *
 *   const parts = optionalParts()
 *   const citations = parts.take("deity citations", await fetchCitations(...), new Map())
 *   return { data, error: null, partial: parts.partial }
 */
export function optionalParts() {
  const failed: string[] = []
  return {
    /** The lookup's data, or `fallback` if it failed. */
    take<T>(label: string, lookup: Lookup<T>, fallback: T): T {
      if (lookup.error) {
        console.error(`${label} query failed:`, lookup.error)
        failed.push(label)
        return fallback
      }
      return lookup.data ?? fallback
    },
    /** True once any optional part has failed. */
    get partial() {
      return failed.length > 0
    },
  }
}
