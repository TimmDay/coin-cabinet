import type { Meta, StoryObj } from "@storybook/nextjs"
import { PageTitle } from "../components/ui/PageTitle"

const meta: Meta<typeof PageTitle> = {
  title: "Components/PageTitle",
  component: PageTitle,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0f172a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description:
        "The title text with the last word automatically accented in gold or purple",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    authPage: {
      control: "boolean",
      description: "Use purple accent instead of gold for authentication pages",
    },
  },
} satisfies Meta<typeof PageTitle>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "The Coin Cabinet",
  },
}

export const SingleWord: Story = {
  args: {
    children: "Cabinet",
  },
}

export const LongTitle: Story = {
  args: {
    children: "Roman Imperial Collection",
  },
}

export const VeryLongTitle: Story = {
  args: {
    children: "Ancient Roman Imperatorial Coin Cabinet",
  },
}

export const AuthPageColors: Story = {
  args: {
    children: "Add Coin",
    authPage: true,
  },
}
