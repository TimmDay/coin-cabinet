import type { Meta, StoryObj } from "@storybook/nextjs"
import { BPImage } from "../components/ui/BPImage"

const meta = {
  title: "Components/BPImage",
  component: BPImage,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Cloudinary image source identifier",
    },
    alt: {
      control: "text",
      description: "Alt text for accessibility",
    },
    caption: {
      control: "text",
      description: "Caption text to display below the image",
    },
    variant: {
      control: "select",
      options: ["fullwidth", "left", "right"],
      description: "Layout variant for the image",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof BPImage>

export default meta
type Story = StoryObj<typeof meta>

// Demo implementation as requested
export const Demo: Story = {
  args: {
    src: "z_pompeii_bikinis",
    alt: "Ancient Roman fresco from Pompeii showing women in bikini-like garments",
    caption:
      "a fresco recovered from Pompeii showing some summer Roman fashion",
    variant: "fullwidth",
  },
}

// Full width variant (default)
export const FullWidth: Story = {
  args: {
    src: "z_pompeii_bikinis",
    alt: "Ancient Roman fresco from Pompeii showing women in bikini-like garments",
    caption:
      "a fresco recovered from Pompeii showing some summer Roman fashion",
    variant: "fullwidth",
  },
}

// Left floating variant with sample text
export const LeftFloating: Story = {
  args: {
    src: "z_pompeii_bikinis",
    alt: "Ancient Roman fresco from Pompeii showing women in bikini-like garments",
    caption:
      "a fresco recovered from Pompeii showing some summer Roman fashion",
    variant: "left",
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <p className="leading-relaxed text-slate-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium.
        </p>
        <div className="clear-both"></div>
      </div>
    ),
  ],
}

// Right floating variant with sample text
export const RightFloating: Story = {
  args: {
    src: "z_pompeii_bikinis",
    alt: "Ancient Roman fresco from Pompeii showing women in bikini-like garments",
    caption:
      "a fresco recovered from Pompeii showing some summer Roman fashion",
    variant: "right",
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <p className="leading-relaxed text-slate-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Sed ut
          perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium.
        </p>
        <div className="clear-both"></div>
      </div>
    ),
  ],
}

// Different image example
export const AlternativeExample: Story = {
  args: {
    src: "sample-coin-image",
    alt: "Roman coin showing emperor portrait",
    caption:
      "A denarius from the reign of Augustus showing the emperor's portrait in profile",
    variant: "fullwidth",
  },
}
