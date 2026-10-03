/**
 * Shared API types for consistent data structures across the application
 */

import type { SomnusCollection } from "~/database/schema-somnus-collection"

/** A note pinned to a clock position on one face of a coin, ready to show. */
export type ClockNote = {
  side: "obverse" | "reverse"
  /** 1 to 12 (12 is straight up, 3 is right). */
  position: number
  title: string | null
  body: string | null
  linkUrl: string | null
  linkLabel: string | null
  /** Which icon shows in the circle. Free text for now. */
  iconType: string | null
}

/**
 * Enhanced coin data with optional joined deity information
 * Used by API endpoints that support ?include=deities parameter
 */
export type CoinEnhanced = SomnusCollection & {
  clock_notes?: ClockNote[]
  /** The mint mark stamped on this coin, e.g. "XXIR". Shown under the reverse legend. */
  mint_mark?: string | null
  deities?: Array<{
    id: number
    name: string
    subtitle?: string
    flavour_text?: string | null
    artifact_ids?: string[]
    place_ids?: number[] | null
    features_coinage?: Array<{
      name: string
      alt_name?: string
      notes?: string
    }>
  }>
  historical_figures?: Array<{
    id: number
    name: string
    full_name?: string | null
    authority?: string | null
    reign_start?: number | null
    reign_end?: number | null
    birth?: number | null
    death?: number | null
    altNames?: string[] | null
    flavour_text?: string | null
    artifact_ids?: string[] | null
  }>
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
