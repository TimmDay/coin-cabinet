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
 * Format: /cabinet/123-marcus-aurelius-denarius
 */
export function generateCoinUrl(
  id: number,
  nickname: string,
  basePath = "/cabinet",
): string {
  const sanitized = sanitizeNickname(nickname)
  return `${basePath}/${id}-${sanitized}`
}

/**
 * Extracts the database ID from a URL slug
 * Input: "123-marcus-aurelius-denarius"
 * Output: 123
 * Returns null if no valid ID is found
 */
export function extractIdFromSlug(slug: string): number {
  if (!slug || typeof slug !== "string") {
    console.error("Invalid slug provided to extractIdFromSlug:", slug)
    return 0
  }

  const idRegex = /^(\d+)-/
  const idMatch = idRegex.exec(slug.trim())

  if (!idMatch?.[1]) {
    console.error("No ID found in slug:", slug)
    return 0
  }

  const id = parseInt(idMatch[1], 10)
  if (isNaN(id) || id <= 0) {
    console.error("Invalid ID extracted from slug:", slug, "->", idMatch[1])
    return 0
  }

  // Log ID extraction in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log(`Extracted ID ${id} from slug: ${slug}`)
  }

  return id
}

/**
 * Validates that a slug has the correct format
 * Should start with digits followed by a hyphen
 */
export function isValidCoinSlug(slug: string): boolean {
  return /^\d+-/.test(slug)
}

/**
 * A link from the database that is safe to put in an href: an http(s) URL or a
 * path on this site. Anything else (a `javascript:` URL, say) comes back null.
 */
export function safeLinkUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const value = url.trim()
  if (value.startsWith("/") && !value.startsWith("//")) return value
  try {
    const { protocol } = new URL(value)
    return protocol === "http:" || protocol === "https:" ? value : null
  } catch {
    return null
  }
}
