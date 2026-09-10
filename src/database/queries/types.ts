/** Discriminated union so `if (error) return` properly narrows `data` to
 * non-null at call sites (a plain `{data: T | null, error: E | null}` object
 * doesn't let TypeScript infer that relationship on its own). */
export type QueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string } }
