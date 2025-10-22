import fs from "fs"
import matter from "gray-matter"
import type { Metadata } from "next"
import path from "path"

// Extract metadata from the MDX file
function getArticleMetadata() {
  const filePath = path.join(
    process.cwd(),
    "src/app/articles/caracalla-and-geta/page.mdx",
  )
  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data } = matter(fileContent)
  return data
}

// Generate metadata from frontmatter
export async function generateMetadata(): Promise<Metadata> {
  const frontmatter = getArticleMetadata() as FrontmatterData

  return {
    title: `${frontmatter.title} | Coin Cabinet`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      images: frontmatter.image
        ? [
            {
              url: frontmatter.image,
              width: 1200,
              height: 630,
              alt: frontmatter.imageAlt ?? frontmatter.title,
            },
          ]
        : undefined,
      siteName: "Coin Cabinet",
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
  }
}

type FrontmatterData = {
  title: string
  description: string
  date: string
  author: string
  slug: string
  image?: string
  imageAlt?: string
  keywords?: string[]
}

export default function CaracallaGettaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const frontmatter = getArticleMetadata() as FrontmatterData

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    ...(frontmatter.image && {
      image: {
        "@type": "ImageObject",
        url: frontmatter.image,
        width: 1200,
        height: 630,
        caption: frontmatter.imageAlt ?? frontmatter.title,
      },
    }),
    author: {
      "@type": "Organization",
      name: frontmatter.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Coin Cabinet",
      logo: {
        "@type": "ImageObject",
        url: "https://coin-cabinet.com/logo.png",
      },
    },
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://coin-cabinet.com/articles/${frontmatter.slug}`,
    },
    articleSection: "History",
    keywords: frontmatter.keywords ?? [],
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
