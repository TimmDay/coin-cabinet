import type { Meta, StoryObj } from "@storybook/nextjs"
import { NotFound404 } from "./NotFound404"

const meta: Meta<typeof NotFound404> = {
  title: "UI/NotFound404",
  component: NotFound404,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Custom title to display instead of '404'",
    },
    message: {
      control: "text",
      description: "Custom message to display instead of 'Page not found'",
    },
    fullScreen: {
      control: "boolean",
      description: "Whether to use full screen height",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomMessage: Story = {
  args: {
    title: "Coin not found",
    message: "The requested coin could not be found",
  },
}

export const FeatureDisabled: Story = {
  args: {
    title: "Feature not available",
    message: "This feature is currently disabled",
  },
}

export const NonFullScreen: Story = {
  args: {
    fullScreen: false,
    title: "Item not found",
    message: "The requested item does not exist",
  },
  parameters: {
    layout: "padded",
  },
}

export const CustomStyling: Story = {
  args: {
    title: "Access denied",
    message: "You don't have permission to view this resource",
    className: "bg-red-50 border border-red-200 rounded-lg",
  },
}
