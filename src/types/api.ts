/**
 * Shared API types for consistent data structures across the application
 */

import type {
  NotableFeature,
  SomnusCollection,
} from "~/database/schema-somnus-collection"

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
  }>
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

/**
 * Update data structure for PATCH operations on coins
 */
export type CoinUpdateData = {
  nickname?: string
  legend_o?: string | null
  legend_o_expanded?: string | null
  legend_o_translation?: string | null
  desc_o?: string | null
  legend_r?: string | null
  legend_r_expanded?: string | null
  legend_r_translation?: string | null
  desc_r?: string | null
  flavour_text?: string | null
  flavour_desc?: string | null
  flavour_img?: string[] | null
  deity_id?: string[] | null
  sets?: string[] | null
  notable_features?: NotableFeature[] | null
}
