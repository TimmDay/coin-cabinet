import { FeaturedCoins } from "~/components/ui/FeaturedCoins"
import { threeMockCoins } from "./mockCoins"

// Mock version of MDXFeaturedCoins for Storybook that doesn't require QueryClient
export function MockMDXFeaturedCoins() {
  return <FeaturedCoins coins={threeMockCoins} />
}
