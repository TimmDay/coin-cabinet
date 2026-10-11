/**
 * Shared API types for consistent data structures across the application
 */

import type { Citation } from "~/database/schema-citations"
import type { Deity } from "~/database/schema-deities"
import type { Mint } from "~/database/schema-mints"
import type { SomnusCollection } from "~/database/schema-somnus-collection"

/** A note pinned to a clock position on one face of a coin, ready to show. */
export type ClockNoteLinkKind =
  "device" | "deity" | "place" | "person" | "mint" | "artifact"

export type ClockNote = {
  side: "obverse" | "reverse"
  /** 1 to 12 (12 is straight up, 3 is right). */
  position: number
  title: string | null
  body: string | null
  linkUrl: string | null
  linkLabel: string | null
  /** The linked entry's picture (a device's or an artifact's), if it has one. */
  imageUrl: string | null
  /** Who to credit for that picture. */
  imageCredit: string | null
  /** What the note links to, which decides its icon; null for a note of its own. */
  linkKind: ClockNoteLinkKind | null
}

/** A deity on a coin, as its deep dive shows it. */
export type CoinDeity = Pick<
  Deity,
  | "id"
  | "name"
  | "subtitle"
  | "flavour_text"
  | "artifact_ids"
  | "place_ids"
  | "features_coinage"
> & { citations: Citation[] }

/** A person on a coin, as its deep dive shows them. */
export type CoinPerson = {
  id: number
  name: string
  full_name: string | null
  /** Their title, e.g. "Emperor". */
  authority: string | null
  reign_start: number | null
  reign_end: number | null
  birth: number | null
  death: number | null
  altNames: string[] | null
  flavour_text: string | null
  artifact_ids: string[]
  citations: Citation[]
}

/**
 * Enhanced coin data with optional joined deity information
 * Used by API endpoints that support ?include=deities parameter
 */
export type CoinEnhanced = SomnusCollection & {
  clock_notes?: ClockNote[]
  /** The mint mark stamped on this coin, e.g. "XXIR". Shown under the reverse legend. */
  mint_mark?: string | null
  /** The mint that struck this coin, or null when none is recorded. */
  mint?: Mint | null
  deities?: CoinDeity[]
  historical_figures?: CoinPerson[]
  /**
   * Where/when the coin was found, sourced from its `provenance_events` row
   * of type "find" via the `public_find_events` view (the only slice of
   * provenance data that's public — see docs/READ_PATH.md).
   * Null if there's no find event on record, or it has no location.
   */
  found_event?: {
    event_date: string | null
    lat: number
    lng: number
    notes: string | null
  } | null
}

/**
 * Standard API response wrapper for consistent error handling
 */
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  message?: string
  error?: string
}
