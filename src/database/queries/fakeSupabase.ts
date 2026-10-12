import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "~/database/database.types"

type Row = Record<string, unknown>

/**
 * A stand-in for the Supabase client in query tests: each table answers with
 * the rows given for it, narrowed by any `eq` and `in` filters on plain
 * columns. Selects, joins and ordering are not applied, so give rows already
 * shaped and ordered as the query expects them. Tables named in `failing`
 * answer with an error instead. `orders` records each `order` call per table.
 */
export function fakeSupabase(
  tables: Record<string, Row[]>,
  failing: string[] = [],
) {
  const orders: Record<string, [string, unknown][]> = {}

  const from = (table: string) => {
    const filters: ((row: Row) => boolean)[] = []
    let single = false
    const result = () => {
      if (failing.includes(table)) {
        return { data: null, error: { message: `${table} is down` } }
      }
      const rows = (tables[table] ?? []).filter((row) =>
        filters.every((keep) => keep(row)),
      )
      return { data: single ? (rows[0] ?? null) : rows, error: null }
    }
    const chain: Record<string, unknown> = {
      select: () => chain,
      returns: () => chain,
      overrideTypes: () => chain,
      eq: (column: string, value: unknown) => {
        filters.push((row) => row[column] === value)
        return chain
      },
      in: (column: string, values: unknown[]) => {
        filters.push((row) => values.includes(row[column]))
        return chain
      },
      order: (column: string, options: unknown) => {
        ;(orders[table] ??= []).push([column, options])
        return chain
      },
      maybeSingle: () => {
        single = true
        return chain
      },
      then: (resolve: (value: unknown) => unknown) => resolve(result()),
    }
    return chain
  }

  return {
    client: { from } as unknown as SupabaseClient<Database>,
    orders,
  }
}
