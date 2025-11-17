/**
 * Utility functions for matching coin nicknames with timeline IDs
 */

import type { Timeline } from "~/data/timelines/types"

/**
 * Normalizes a string by:
 * - Converting to lowercase
 * - Splitting on whitespace and hyphens
 * - Joining with empty string
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s-]+/)
    .join("")
}

/**
 * Matches a coin nickname with available timelines
 * @param nickname - The coin's nickname
 * @param timelines - Object of available timelines keyed by ID
 * @returns The matching timeline or null if no match found
 */
export function matchTimelineToNickname(
  nickname: string | null | undefined,
  timelines: Record<string, Timeline>,
): Timeline | null {
  if (!nickname) return null

  const normalizedNickname = normalizeString(nickname)

  // Find a timeline whose normalized ID is a substring of the normalized nickname
  for (const [timelineId, timeline] of Object.entries(timelines)) {
    const normalizedTimelineId = normalizeString(timelineId)

    if (normalizedNickname.includes(normalizedTimelineId)) {
      return timeline
    }
  }

  return null
}
