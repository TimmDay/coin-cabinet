import fs from "fs"
import matter from "gray-matter"
import path from "path"

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
 * Get article metadata from MDX frontmatter
 * This function runs on the server side only
 */
export function getArticleMetadataFromFile(
  articlePath: string,
): ArticleMetadata | null {
  try {
    const filePath = path.join(process.cwd(), articlePath)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContent)
    return data as ArticleMetadata
  } catch (error) {
    console.warn(`Could not read article metadata from ${articlePath}:`, error)
    return null
  }
}

/**
 * Get all available article metadata
 * Maps pathname to metadata for client-side lookup
 */
export function getAllArticleMetadata(): Record<string, ArticleMetadata> {
  const articles: Record<string, ArticleMetadata> = {}

  // Add Caracalla and Geta article
  const caracallaMetadata = getArticleMetadataFromFile(
    "src/app/articles/caracalla-and-geta/page.mdx",
  )
  if (caracallaMetadata) {
    articles["/articles/caracalla-and-geta"] = caracallaMetadata
  }

  // You can add more articles here as you create them
  // const anotherArticle = getArticleMetadataFromFile("src/app/articles/another-article/page.mdx")
  // if (anotherArticle) {
  //   articles["/articles/another-article"] = anotherArticle
  // }

  return articles
}
