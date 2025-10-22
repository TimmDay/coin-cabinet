import { FeaturedCoins } from "./ui/FeaturedCoins"

// MDX components mapping with proper styling
export function useMDXComponents(
  components?: Record<string, React.ComponentType>,
) {
  return {
    // Custom components for MDX
    FeaturedCoins,
    // Default components with styling
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props} className="text-foreground mb-6 text-3xl font-bold" />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 {...props} className="text-foreground mb-4 text-2xl font-semibold" />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props} className="text-foreground mb-3 text-xl font-medium" />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props} className="mb-4 leading-relaxed text-slate-300" />
    ),
    ...components,
  }
}
