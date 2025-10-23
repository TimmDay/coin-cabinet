import { ClientArticleLayout } from "~/components/layout/ClientArticleLayout"
import { getAllArticleMetadata } from "~/lib/utils/article-metadata"

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get all article metadata on the server side - this is the server-side work
  const articleMetadata = getAllArticleMetadata()

  // Pass metadata to client component for pathname-based lookup
  return (
    <ClientArticleLayout articleMetadata={articleMetadata}>
      {children}
    </ClientArticleLayout>
  )
}
