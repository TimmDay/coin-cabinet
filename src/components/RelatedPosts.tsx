import { EmbeddedBlogLinkCaracallaGeta } from "~/components/blog/EmbeddedBlogLinkCaracallaGeta"

type RelatedPostsProps = {
  nickname?: string
}

/**
 * Component that displays related blog posts based on coin information
 */
export function RelatedPosts({ nickname }: RelatedPostsProps) {
  // Check if this coin is related to Caracalla
  const isCaracallaCoin = nickname?.toLowerCase().includes("caracalla") ?? false

  // Return null if no related posts found
  if (!isCaracallaCoin) {
    return null
  }

  return (
    <div className="related-posts">
      {/* Show Caracalla and Geta blog post for Caracalla coins */}
      {isCaracallaCoin && <EmbeddedBlogLinkCaracallaGeta />}
    </div>
  )
}
