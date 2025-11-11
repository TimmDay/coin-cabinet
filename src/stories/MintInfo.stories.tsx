import type { Meta, StoryObj } from "@storybook/nextjs"
import { MintInfo } from "../components/ui"

const meta = {
  title: "Components/MintInfo",
  component: MintInfo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A component that displays detailed information about Roman mints, including operation periods, founding emperor, and historical context. Shows a 2-column layout on desktop (25%/75%) that stacks on mobile.",
      },
    },
    backgrounds: {
      default: "app-background",
      values: [
        {
          name: "app-background",
          value: "hsl(218 23% 11%)", // --background CSS variable value
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: "hsl(218 23% 11%)", // --background value
          color: "hsl(210 15% 96%)", // --foreground value
          minHeight: "100vh",
          padding: "2rem",
          fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    mintName: {
      description: "The name of the Roman mint to display information for",
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof MintInfo>

export default meta
type Story = StoryObj<typeof meta>

export const Lugdunum: Story = {
  args: {
    mintName: "Lugdunum",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows information for the Lugdunum mint (modern-day Lyon, France), one of the most important mints in the Roman Empire. This mint supplied coins to the legions in Gaul and along the Rhine frontier.",
      },
    },
  },
}

export const Rome: Story = {
  args: {
    mintName: "Rome",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows information for the Rome mint, the primary mint of the Roman Empire.",
      },
    },
  },
}

export const Alexandria: Story = {
  args: {
    mintName: "Alexandria",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows information for the Alexandria mint in Egypt, an important provincial mint.",
      },
    },
  },
}

export const NonExistentMint: Story = {
  args: {
    mintName: "NonExistentMint",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the component's behavior when no matching mint data is found - it should render nothing gracefully.",
      },
    },
  },
}
