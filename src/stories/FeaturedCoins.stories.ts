import type { Meta, StoryObj } from "@storybook/nextjs"
import { FeaturedCoins } from "../components/ui/FeaturedCoins"
import { threeMockCoins } from "./mockCoins"

const meta: Meta<typeof FeaturedCoins> = {
  title: "Components/FeaturedCoins",
  component: FeaturedCoins,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component that displays exactly three featured coins side by side (stacked on mobile). Each coin links to its deep dive page when clicked.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Optional title for the featured coins section",
    },
    coins: {
      description: "Array of exactly 3 coin objects to display",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes to apply",
    },
    displayTextOnHover: {
      control: { type: "boolean" },
      description: "Whether to show coin nickname and denomination on hover",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Featured Coins",
    coins: threeMockCoins,
  },
}

export const NoTitle: Story = {
  args: {
    coins: threeMockCoins,
    title: "",
  },
}

export const CustomTitle: Story = {
  args: {
    title: "Coins of the Week",
    coins: threeMockCoins,
  },
}

export const WithHoverText: Story = {
  args: {
    title: "Featured Coins with Hover Text",
    coins: threeMockCoins,
    displayTextOnHover: true,
  },
}
