import type { Meta, StoryObj } from "@storybook/nextjs"
import { Loading } from "~/components/ui/Loading"

const meta: Meta<typeof Loading> = {
  title: "UI/Loading",
  component: Loading,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Versatile loading component used across the entire application. Provides consistent styling and layout for different loading contexts with three distinct variants: admin, page, and component layouts.",
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0f172a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  argTypes: {
    message: {
      control: "text",
      description: "Custom loading message",
      defaultValue: "Loading...",
    },
    className: {
      control: "text",
      description: "Optional CSS classes for the loading text",
      defaultValue: "coin-description text-xl",
    },
    variant: {
      control: "select",
      options: ["admin", "page", "component"],
      description: "Layout variant for different use cases",
      defaultValue: "admin",
      table: {
        type: { summary: '"admin" | "page" | "component"' },
        defaultValue: { summary: '"admin"' },
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

// Default admin layout
export const AdminLayout: Story = {
  args: {
    message: "Loading...",
    variant: "admin",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default admin page layout with container and standard spacing. Used for admin dashboard pages.",
      },
    },
  },
}

// Full page layout
export const PageLayout: Story = {
  args: {
    message: "Loading coin details...",
    variant: "page",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-page centered layout for main content pages. Uses flexbox centering and content wrapper.",
      },
    },
  },
}

// Component layout
export const ComponentLayout: Story = {
  args: {
    message: "Loading collection...",
    variant: "component",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Minimal component-level loading state for use within existing layouts. Compact and lightweight.",
      },
    },
  },
}

// Custom message examples
export const CustomMessages: Story = {
  args: {
    message: "Authenticating user...",
    variant: "admin",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with custom loading message. Messages can be tailored to specific contexts.",
      },
    },
  },
}

// Custom styling
export const CustomStyling: Story = {
  args: {
    message: "Loading deities from the pantheon...",
    className: "text-2xl font-bold text-amber-400",
    variant: "admin",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Custom styling example with larger, bold text in amber color. Demonstrates className customization.",
      },
    },
  },
}

// Real-world usage examples
export const AuthenticationLoading: Story = {
  args: {
    message: "Verifying credentials...",
    variant: "admin",
  },
  parameters: {
    docs: {
      description: {
        story: "Typical usage during authentication flow in admin pages.",
      },
    },
  },
}

export const DataFetching: Story = {
  args: {
    message: "Loading Somnus collection...",
    variant: "component",
    className: "coin-description text-lg",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Component-level loading for data fetching operations within existing page layouts.",
      },
    },
  },
}

export const CoinDetails: Story = {
  args: {
    message: "Loading coin details...",
    variant: "page",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-page loading for main content areas like coin detail pages.",
      },
    },
  },
}
