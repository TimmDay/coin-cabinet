import type { ArticleMetadata } from "./article-metadata"

/**
 * Validation helpers for article content
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function validateMetadata(
  metadata: unknown,
): metadata is ArticleMetadata {
  if (!isRecord(metadata)) {
    throw new Error("Article metadata must be an object")
  }

  const required = ["title", "description", "date", "author", "slug"]

  for (const field of required) {
    if (!metadata[field]) {
      throw new Error(`Article metadata missing required field: ${field}`)
    }
  }

  if (
    typeof metadata.title !== "string" ||
    typeof metadata.description !== "string" ||
    typeof metadata.date !== "string" ||
    typeof metadata.author !== "string" ||
    typeof metadata.slug !== "string"
  ) {
    throw new Error("Article metadata fields must be strings")
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)) {
    throw new Error(
      `Invalid date format. Use YYYY-MM-DD format. Got: ${metadata.date}`,
    )
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(metadata.slug)) {
    throw new Error(
      `Invalid slug format. Use lowercase letters, numbers, and hyphens only. Got: ${metadata.slug}`,
    )
  }

  // Validate keywords array
  if (
    metadata.keywords !== undefined &&
    (!Array.isArray(metadata.keywords) ||
      metadata.keywords.some((keyword) => typeof keyword !== "string"))
  ) {
    throw new Error("Keywords must be an array of strings")
  }

  return true
}

/**
 * Generate reading time estimate
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Extract headings from article content for table of contents
 */
export function extractHeadings(
  content: string,
): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /<(h[1-6])[^>]*>([^<]+)<\/h[1-6]>/gi
  const headings = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    if (!match[1] || !match[2]) continue
    const level = parseInt(match[1].charAt(1))
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    headings.push({ level, text, id })
  }

  return headings
}

/**
 * Generate article excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]+>/g, "").trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength)
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("!"),
    truncated.lastIndexOf("?"),
  )

  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1)
  }

  // If no sentence boundary, cut at word boundary
  const lastSpace = truncated.lastIndexOf(" ")
  return truncated.substring(0, lastSpace) + "..."
}
