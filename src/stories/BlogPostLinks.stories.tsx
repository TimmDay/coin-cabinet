import type { Meta, StoryObj } from "@storybook/nextjs"
import { BlogPostLinks } from "~/components/ui/BlogPostLinks"

const meta: Meta<typeof BlogPostLinks> = {
  title: "UI/BlogPostLinks",
  component: BlogPostLinks,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Component for displaying related blog post links on coin detail pages. Automatically infers titles from routes and ensures proper URL formatting.",
      },
    },
  },
  argTypes: {
    routes: {
      control: "object",
      description: "Array of blog post routes to display as links",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story with multiple routes
export const Default: Story = {
  args: {
    routes: [
      "/articles/caracalla-and-geta",
      "/articles/severan-dynasty",
      "articles/imperial-women",
    ],
  },
}

// Single route example
export const SingleRoute: Story = {
  args: {
    routes: ["/articles/marcus-aurelius"],
  },
}

// Routes with nested paths (preserves full structure)
export const NestedPaths: Story = {
  args: {
    routes: [
      "articles/year-in-coins/2025",
      "/articles/emperors/marcus-aurelius",
      "articles/dynasties/severan-dynasty",
    ],
  },
}

// Mixed routes (some with, some without leading slash)
export const MixedRoutes: Story = {
  args: {
    routes: [
      "/articles/caracalla-and-geta",
      "articles/severan-dynasty",
      "/articles/imperial-women",
      "articles/roman-mints",
    ],
  },
}

// Empty routes (should render nothing)
export const EmptyRoutes: Story = {
  args: {
    routes: [],
  },
}
