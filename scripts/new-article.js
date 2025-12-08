#!/usr/bin/env node

/**
 * Article Generator Script
 *
 * Creates a new article with all the necessary boilerplate.
 *
 * Usage:
 * npm run new-article "My Article Title"
 * or
 * node scripts/new-article.js "My Article Title"
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * @param {string} title
 */
function generateArticle(title) {
  const slug = slugify(title)
  const articlesDir = path.join(__dirname, "../src/app/articles")
  const articleDir = path.join(articlesDir, slug)

  // Check if article already exists
  if (fs.existsSync(articleDir)) {
    console.error(`❌ Article "${slug}" already exists!`)
    process.exit(1)
  }

  // Create directory
  fs.mkdirSync(articleDir, { recursive: true })

  // Generate page.tsx
  const pageContent = `import { Aside } from "../../../components/Aside"
import { BPImage } from "../../../components/ui/BPImage"
import { BPBreak } from "../../../components/blog/BPBreak"
import { H2, H3, P, Lead, Quote, Callout, Timeline, CoinComparison, ImageGrid, ArticleImage, FeaturedCoinsWithData } from "../components"

// Article metadata
export const metadata = {
  title: "${title}",
  subtitle: "Your article subtitle here",
  description: "A compelling description of your article for SEO and social sharing.",
  date: "${new Date().toISOString().split("T")[0]}", // Today's date
  author: "Coin Cabinet",
  slug: "${slug}",
  image: "https://res.cloudinary.com/coin-cabinet/image/upload/v1234567890/blog/${slug}-header.jpg",
  imageAlt: "Description of your header image for accessibility",
  keywords: [
    // Add relevant keywords here
    "Roman Empire",
    "Ancient Coins",
    "Numismatics",
    "History",
  ],
}

export default function ${title.replace(/[^\w]/g, "")}Article() {
  return (
    <article className="prose prose-lg prose-slate prose-invert max-w-none">
      {/* Hero image (optional) */}
      <ArticleImage
        src="your-image-id"
        alt="Description of the image"
        caption="Caption for the image"
        layout="center"
        size="large"
      />

      {/* Opening paragraph */}
      <Lead>
        Your compelling opening paragraph that introduces the topic and hooks the reader.
      </Lead>

      <H2>First Section</H2>

      <P>
        Start writing your article content here. Use the imported components for consistent styling.
      </P>

      {/* Example components you can use: */}

      {/* Quote example */}
      <Quote author="Historical Figure" source="Ancient Text">
        A relevant historical quote that adds context to your article.
      </Quote>

      {/* Callout example */}
      <Callout type="info" title="Historical Context">
        Important background information or interesting facts.
      </Callout>

      <H3>Subsection</H3>

      <P>
        Continue your content with subsections as needed.
      </P>

      {/* Timeline example */}
      <Timeline events={[
        {
          date: "Year 1",
          title: "Event Title",
          description: "Description of what happened"
        },
        {
          date: "Year 2",
          title: "Another Event",
          description: "More historical context"
        }
      ]} />

      <H2>Another Section</H2>

      {/* Coin comparison example */}
      <CoinComparison
        title="Obverse vs Reverse"
        before={{
          src: "coin-obverse-id",
          alt: "Coin obverse",
          caption: "Emperor portrait side"
        }}
        after={{
          src: "coin-reverse-id",
          alt: "Coin reverse",
          caption: "Reverse design"
        }}
      />

      <P>
        More article content...
      </P>

      {/* Featured coins */}
      <FeaturedCoinsWithData />

      <H2>Conclusion</H2>

      <P>
        Wrap up your article with key takeaways and conclusions.
      </P>
    </article>
  )
}`

  // Generate layout.tsx
  const layoutContent = `import { createArticleLayout } from "../ArticleLayout"
import { metadata } from "./page"

export const { generateMetadata, default: Layout } = createArticleLayout(metadata)
export default Layout`

  // Write files
  fs.writeFileSync(path.join(articleDir, "page.tsx"), pageContent)
  fs.writeFileSync(path.join(articleDir, "layout.tsx"), layoutContent)

  console.log(`✅ Created new article: "${title}"`)
  console.log(`📁 Location: src/app/articles/${slug}/`)
  console.log(`🔗 URL: /articles/${slug}`)
  console.log(`\n📝 Next steps:`)
  console.log(`1. Update the metadata in page.tsx`)
  console.log(`2. Replace placeholder content with your article`)
  console.log(`3. Add images to Cloudinary and update image references`)
  console.log(`4. Update keywords for SEO`)
}

// Get title from command line arguments
const title = process.argv[2]

if (!title) {
  console.error("❌ Please provide an article title:")
  console.log('Usage: npm run new-article "Your Article Title"')
  process.exit(1)
}

generateArticle(title)
