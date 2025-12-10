/* eslint-disable @typescript-eslint/no-require-imports */

export type ArticleMetadata = {
  title: string
  subtitle?: string
  description?: string
  date?: string
  author?: string
  slug?: string
  image?: string
  imageAlt?: string
  keywords?: string[]
}

/**
 * Get all available article metadata
 * Maps pathname to metadata for client-side lookup
 */
// TODO: a lot of ESLint dodging in here
export function getAllArticleMetadata(): Record<string, ArticleMetadata> {
  const articles: Record<string, ArticleMetadata> = {}

  // Add articles here as you create them
  try {
    // Import the metadata from React components
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
      metadata: caracallaMetadata,
    } = require("../../app/articles/caracalla-and-geta/page")
    if (caracallaMetadata) {
      articles["/articles/caracalla-and-geta"] = caracallaMetadata
    }
  } catch (error) {
    console.warn("Could not load Caracalla article metadata:", error)
  }

  // Add more articles here:
  // try {
  //   const { metadata } = require("../../app/articles/your-article/page")
  //   if (metadata) {
  //     articles["/articles/your-article"] = metadata
  //   }
  // } catch (error) {
  //   console.warn("Could not load article metadata:", error)
  // }

  return articles
}
