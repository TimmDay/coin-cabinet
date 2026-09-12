/**
 * Shared API types for consistent data structures across the application
 */

import type { SomnusCollection } from "~/database/schema-somnus-collection"

/**
 * Enhanced coin data with optional joined deity information
 * Used by API endpoints that support ?include=deities parameter
 */
export type CoinEnhanced = SomnusCollection & {
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
   * provenance data that's public — see docs/SCHEMA_MIGRATION_READ_PATH.md).
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

/**
 * Specific response type for coin API endpoints
 */
export type CoinApiResponse = ApiResponse<CoinEnhanced>
