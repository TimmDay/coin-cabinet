import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoinSketchCompare } from "~/components/ui/coin-deep-dive/CoinSketchCompare"
import { mockCoinWithSketches, mockCoinWithoutSketches } from "./mockCoins"

const meta: Meta<typeof CoinSketchCompare> = {
  title: "Components/CoinSketchCompare",
  component: CoinSketchCompare,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component for comparing coin photographs with sketch illustrations side by side. Displays obverse and reverse sides with their respective legends and translations. Adapts to show single images when sketches are unavailable.",
      },
    },
  },
  argTypes: {
    imageLinkO: {
      control: "text",
      description: "Cloudinary ID for the obverse photograph",
    },
    imageLinkSketchO: {
      control: "text",
      description: "Cloudinary ID for the obverse sketch (optional)",
    },
    imageLinkR: {
      control: "text",
      description: "Cloudinary ID for the reverse photograph",
    },
    imageLinkSketchR: {
      control: "text",
      description: "Cloudinary ID for the reverse sketch (optional)",
    },
    legendExpandedO: {
      control: "text",
      description: "Expanded legend text for obverse side",
    },
    legendTranslationO: {
      control: "text",
      description: "Translation of obverse legend",
    },
    legendExpandedR: {
      control: "text",
      description: "Expanded legend text for reverse side",
    },
    legendTranslationR: {
      control: "text",
      description: "Translation of reverse legend",
    },
  },
} satisfies Meta<typeof CoinSketchCompare>

export default meta
type Story = StoryObj<typeof meta>

export const WithAllSketches: Story = {
  args: {
    ...mockCoinWithSketches,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete comparison showing both photographs and sketches for obverse and reverse sides with legends and translations.",
      },
    },
  },
}

export const WithoutSketches: Story = {
  args: {
    ...mockCoinWithoutSketches,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Layout when sketch images are unavailable - photographs take full width with legends and translations displayed normally.",
      },
    },
  },
}

export const OnlyObverseSketch: Story = {
  args: {
    ...mockCoinWithSketches,
    imageLinkSketchR: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mixed layout where only the obverse has a sketch available. Shows adaptive grid behavior.",
      },
    },
  },
}

export const OnlyReverseSketch: Story = {
  args: {
    ...mockCoinWithSketches,
    imageLinkSketchO: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mixed layout where only the reverse has a sketch available. Demonstrates flexible grid system.",
      },
    },
  },
}

export const MinimalLegends: Story = {
  args: {
    ...mockCoinWithSketches,
    legendExpandedO: "LABEO",
    legendTranslationO: "banana",
    legendExpandedR: "ROMA",
    legendTranslationR: "banana",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Simplified version with only basic legends and no translations to test minimal content scenarios.",
      },
    },
  },
}

export const NoLegends: Story = {
  args: {
    ...mockCoinWithSketches,
    legendExpandedO: null,
    legendTranslationO: null,
    legendExpandedR: null,
    legendTranslationR: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pure image comparison without any legend text, useful for worn or illegible coins.",
      },
    },
  },
}
