/**
 * Article Components
 *
 * Reusable components specifically for article authoring.
 * These provide consistent styling and make it easy to write articles
 * with proper typography and layout.
 *
 * Import pattern:
 * import { H2, H3, P, Lead } from "../components"
 * import { Quote, Callout, Timeline } from "../components"
 * import { CoinComparison, ImageGrid } from "../components"
 */

// Headings
export { H1, H2, H3, H4 } from "./Headings"

// Typography
export { P, Lead } from "./Typography"

// Content components
export { Quote, Callout, Timeline } from "./Content"

// Media components
export {
  CoinComparison,
  ImageGrid,
  ArticleImage,
  FeaturedCoinsWithData,
} from "./Media"
