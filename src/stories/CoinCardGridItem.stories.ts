import type { Meta, StoryObj } from "@storybook/nextjs";
import { CoinCardGridItem } from "../components/ui/CoinCardGridItem";

const meta: Meta<typeof CoinCardGridItem> = {
  title: "Components/CoinCardGridItem",
  component: CoinCardGridItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A card component for displaying coins with hover effects and modal triggering. Uses individual props for optimal performance.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    view: {
      control: { type: "select" },
      options: ["obverse", "reverse", "both"],
      description: "Which coin side(s) to display",
    },
    civ: {
      control: { type: "text" },
      description: "Civilization of the coin",
    },
    nickname: {
      control: { type: "text" },
      description: "Nickname or ruler name",
    },
    denomination: {
      control: { type: "text" },
      description: "Denomination type",
    },
    mintYearEarliest: {
      control: { type: "number" },
      description: "Earliest mint year",
    },
    mintYearLatest: {
      control: { type: "number" },
      description: "Latest mint year",
    },
    obverseImageId: {
      control: { type: "text" },
      description: "Obverse image identifier",
    },
    reverseImageId: {
      control: { type: "text" },
      description: "Reverse image identifier",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    civ: "Roman Imperial",
    nickname: "Faustina II",
    denomination: "Sestertius",
    mintYearEarliest: 161,
    mintYearLatest: 176,
    obverseImageId:
      "20250820__faustina-ii-sestertius__o__src-imperial-numismatics",
    reverseImageId:
      "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
  },
};

// View variants
export const ObverseOnly: Story = {
  args: {
    civ: "Roman Imperial",
    nickname: "Augustus",
    denomination: "Denarius",
    mintYearEarliest: -27,
    mintYearLatest: 14,
    obverseImageId:
      "20250820__faustina-ii-sestertius__o__src-imperial-numismatics",
    reverseImageId:
      "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
    view: "obverse",
  },
};

export const ReverseOnly: Story = {
  args: {
    civ: "Roman Imperial",
    nickname: "Augustus",
    denomination: "Denarius",
    mintYearEarliest: -27,
    mintYearLatest: 14,
    obverseImageId:
      "20250820__faustina-ii-sestertius__o__src-imperial-numismatics",
    reverseImageId:
      "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
    view: "reverse",
  },
};

export const CrossingEras: Story = {
  args: {
    civ: "Roman Imperial",
    nickname: "First Emperor",
    denomination: "Denarius",
    mintYearEarliest: -27,
    mintYearLatest: 14,
    obverseImageId: "1_faustina_II_sestertius_o_qnuswl",
    reverseImageId:
      "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
  },
};

export const BothErasBCE: Story = {
  args: {
    civ: "Macedonian Kingdom",
    nickname: "Alexander the Great",
    denomination: "Tetradrachm",
    mintYearEarliest: -336,
    mintYearLatest: -323,
    obverseImageId: "1_faustina_II_sestertius_o_qnuswl",
    reverseImageId: "1_faustina_II_sestertius_r_hy1nu3",
    view: "both",
  },
};
