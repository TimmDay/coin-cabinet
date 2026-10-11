/** Discriminated union so `if (error) return` properly narrows `data` to
 * non-null at call sites (a plain `{data: T | null, error: E | null}` object
 * doesn't let TypeScript infer that relationship on its own).
 *
 * `partial` marks a read that succeeded without one of its optional parts (see
 * `optionalParts`): the data is usable, but should not be cached. */
export type QueryResult<T> =
  | { data: T; error: null; partial?: boolean }
  | { data: null; error: { message: string }; partial?: never }
