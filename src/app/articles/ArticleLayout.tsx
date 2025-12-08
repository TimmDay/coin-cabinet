import type { Metadata } from "next"

type ArticleMetadata = {
  title: string
  subtitle?: string
  description: string
  date: string
  author: string
  slug: string
  image?: string
  imageAlt?: string
  keywords?: string[]
}

/**
 * Generic Article Layout
 *
 * This layout can be used by any article by:
 * 1. Importing the article's metadata from its page.tsx
 * 2. Generating Next.js metadata for SEO
 * 3. Creating JSON-LD structured data
 *
 * Usage in article layout.tsx:
 * ```tsx
 * import { createArticleLayout } from "../ArticleLayout"
 * import { metadata } from "./page"
 *
 * export const { generateMetadata, default: Layout } = createArticleLayout(metadata)
 * export default Layout
 * ```
 */
export function createArticleLayout(articleMetadata: ArticleMetadata) {
  // Generate Next.js metadata from article metadata object
  async function generateMetadata(): Promise<Metadata> {
    const article = articleMetadata

    return {
      title: `${article.title} | Coin Cabinet`,
      description: article.description,
      keywords: article.keywords,
      authors: [{ name: article.author }],
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        publishedTime: article.date,
        authors: [article.author],
        images: article.image
          ? [
              {
                url: article.image,
                width: 1200,
                height: 630,
                alt: article.imageAlt ?? article.title,
              },
            ]
          : undefined,
        siteName: "Coin Cabinet",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
        images: article.image ? [article.image] : undefined,
      },
    }
  }

  function ArticleLayout({ children }: { children: React.ReactNode }) {
    const article = articleMetadata

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      ...(article.image && {
        image: {
          "@type": "ImageObject",
          url: article.image,
          width: 1200,
          height: 630,
          caption: article.imageAlt ?? article.title,
        },
      }),
      author: {
        "@type": "Organization",
        name: article.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Coin Cabinet",
        logo: {
          "@type": "ImageObject",
          url: "https://coin-cabinet.com/logo.png",
        },
      },
      datePublished: article.date,
      dateModified: article.date,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://coin-cabinet.com/articles/${article.slug}`,
      },
      articleSection: "History",
      keywords: article.keywords ?? [],
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </>
    )
  }

  return {
    generateMetadata,
    default: ArticleLayout,
  }
}
