// ============================================================================
// TIMELINES - Historical event sequences for coins and historical context
// ============================================================================

// Re-export the existing types from the data layer for consistency
export type {
  EventKind,
  Event,
  Timeline as TimelineEvents,
} from "~/data/timelines/types"

// Import for use in this file
import type { Timeline as TimelineEventsArray } from "~/data/timelines/types"

// Database table schema for timelines
export type Timeline = {
  id: number
  name: string // Used for UI selection (e.g., "first-jewish-war", "macrinus")
  timeline: TimelineEventsArray // Array of Event objects stored as JSONB
  created_at: string
  updated_at: string
  user_id: string
}

// Form data type for timeline creation/editing
export type TimelineFormData = {
  name: string
  timeline: TimelineEventsArray
}

// Response types for API operations
export type TimelineResponse = {
  success: boolean
  data?: Timeline[]
  timeline?: Timeline
  message?: string
  error?: string
}

// Timeline with metadata for admin operations
export type TimelineWithMeta = Timeline & {
  eventCount: number
  yearRange: string
  hasCoordinates: boolean
}
