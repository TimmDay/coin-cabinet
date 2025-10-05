/**
 * URL utilities for generating human-readable coin URLs
 */

/**
 * Sanitizes a coin nickname for use in URLs
 * Removes punctuation, converts to lowercase, replaces spaces with hyphens
 */
export function sanitizeNickname(nickname: string): string {
  return nickname
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove punctuation except hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * Generates a human-readable URL for a coin
 * Format: /coin/123-marcus-aurelius-denarius
 */
export function generateCoinUrl(
  id: number,
  nickname: string,
  basePath = "/coin",
): string {
  const sanitized = sanitizeNickname(nickname)
  return `${basePath}/${id}-${sanitized}`
}

/**
 * Generates a human-readable URL for a coin within a set
 * Format: /sets/severan-dynasty/123-marcus-aurelius-denarius
 */
export function generateSetCoinUrl(
  setSlug: string,
  id: number,
  nickname: string,
): string {
  return generateCoinUrl(id, nickname, `/sets/${setSlug}`)
}

/**
 * Extracts the database ID from a URL slug
 * Input: "123-marcus-aurelius-denarius"
 * Output: 123
 */
export function extractIdFromSlug(slug: string): number {
  const idRegex = /^(\d+)-/
  const idMatch = idRegex.exec(slug)
  return idMatch?.[1] ? parseInt(idMatch[1], 10) : 0
}

/**
 * Extracts the nickname portion from a URL slug
 * Input: "123-marcus-aurelius-denarius"
 * Output: "marcus-aurelius-denarius"
 */
export function extractNicknameFromSlug(slug: string): string {
  const nicknameRegex = /^\d+-(.+)$/
  const nicknameMatch = nicknameRegex.exec(slug)
  return nicknameMatch?.[1] ?? ""
}

/**
 * Validates that a slug has the correct format
 * Should start with digits followed by a hyphen
 */
export function isValidCoinSlug(slug: string): boolean {
  return /^\d+-/.test(slug)
}
