"use client"

import { useSyncExternalStore } from "react"

/** Nothing ever changes: a document either exists for this render or it does not. */
const subscribe = () => () => {}

/**
 * True once rendering on the client, false on the server.
 *
 * Portals need this: `document` does not exist during a server render, so the
 * portal cannot be created until hydration. The obvious way to write it is a
 * `useState(false)` flipped to true in an effect, which works but costs a
 * second render pass and trips `react-hooks/set-state-in-effect`. Reading it
 * as an external store says the same thing without copying it into state.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
