import { MDXFeaturedCoins } from "./src/components/mdx/MDXFeaturedCoins"
import { BPImage } from "./src/components/ui/BPImage"

// Helper function to generate id from text content
function generateId(text: string | React.ReactNode): string {
  const textContent = typeof text === "string" ? text : "heading"
  return textContent
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

// MDX components mapping with proper styling for Next.js
export function useMDXComponents(
  components?: Record<string, React.ComponentType>,
) {
  return {
    // Custom components for MDX
    FeaturedCoins: MDXFeaturedCoins,
    BPImage: BPImage,
    // Default components with styling and auto-generated IDs
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        props.id ?? (props.children ? generateId(props.children) : undefined)
      return (
        <h1
          {...props}
          id={id}
          className="text-foreground mb-6 text-3xl font-bold"
        />
      )
    },
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        props.id ?? (props.children ? generateId(props.children) : undefined)
      return (
        <h2
          {...props}
          id={id}
          className="text-foreground mb-4 text-2xl font-semibold"
        />
      )
    },
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id =
        props.id ?? (props.children ? generateId(props.children) : undefined)
      return (
        <h3
          {...props}
          id={id}
          className="text-foreground mb-3 text-xl font-medium"
        />
      )
    },
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="mb-4 leading-relaxed text-slate-300" />
    ),
    ...components,
  }
}
