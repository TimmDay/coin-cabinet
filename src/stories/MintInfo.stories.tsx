import type { Meta, StoryObj } from "@storybook/nextjs"
import { MintDeepDiveCard } from "../components/ui"

const meta = {
  title: "Components/MintDeepDiveCard",
  component: MintDeepDiveCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A component that displays detailed information about Roman mints using the DeepDiveCard component. Shows mint name as title, operation periods as subtitle, flavour text as primary info, and mint marks as footer. Features an accordion-style expandable content area.",
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
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    mintId: {
      description: "The ID of the mint to display information for",
      control: { type: "number" },
    },
  },
} satisfies Meta<typeof MintDeepDiveCard>

export default meta
type Story = StoryObj<typeof meta>

export const Lugdunum: Story = {
  args: {
    mintId: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows information for the Lugdunum mint (modern-day Lyon, France) using the new DeepDiveCard layout. Displays operation periods, historical context, and mint marks in an accordion format.",
      },
    },
  },
}

export const Rome: Story = {
  args: {
    mintId: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows information for the Rome mint, the primary mint of the Roman Empire, presented in the new DeepDiveCard format with gold title and accordion content.",
      },
    },
  },
}

export const Alexandria: Story = {
  args: {
    mintId: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows information for the Alexandria mint in Egypt, an important provincial mint. Demonstrates the DeepDiveCard format with operation periods and historical context.",
      },
    },
  },
}

export const MultipleMints: Story = {
  args: {
    mintId: 1,
  },
  render: () => (
    <div className="space-y-4">
      <MintDeepDiveCard mintId={1} />
      <MintDeepDiveCard mintId={2} />
      <MintDeepDiveCard mintId={3} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows multiple MintInfo components using DeepDiveCard layout. Demonstrates how they stack and maintain independent accordion states.",
      },
    },
  },
}

export const NonExistentMint: Story = {
  args: {
    mintId: 999,
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
