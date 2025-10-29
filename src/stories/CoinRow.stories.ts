import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoinRow } from "../components/ui/coin-deep-dive/CoinRow"

const meta: Meta<typeof CoinRow> = {
  title: "Components/CoinRow",
  component: CoinRow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "radio",
      options: ["obverse", "reverse"],
      description: "Which side of the coin this row represents",
    },
    imageLink: {
      control: "text",
      description: "Main coin image ID",
    },
    imageLinkAltlight: {
      control: "text",
      description: "Alternative lighting image ID (optional)",
    },
    imageLinkSketch: {
      control: "text",
      description: "Sketch/line drawing image ID (optional)",
    },
    legendExpanded: {
      control: "text",
      description: "Expanded legend text",
    },
    legendTranslation: {
      control: "text",
      description: "Translation of the legend",
    },
    description: {
      control: "text",
      description: "Description of the imagery",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const ObverseWithAllImages: Story = {
  args: {
    side: "obverse",
    imageLink: "20250911__q-fabius-labeo-denarius__o__src-the-coin-cabinet",
    imageLinkAltlight:
      "20250714__faustina-ii-denarius__o__src-imperial-numismatics",
    imageLinkSketch:
      "20250911__q-fabius-labeo-denarius__o__src-the-coin-cabinet",
    legendExpanded: " X ROMA LABEO (M. Atilius)",
    legendTranslation: "issued by Labeo (moneyer) on behalf of Rome",
    description:
      "Helmeted head of Roma to right; X (mark of value) below chin, ROMA downwards behind, LABEO upwards before.",
  },
}

export const ReverseWithMainAndSketch: Story = {
  args: {
    side: "reverse",
    imageLink: "20250911__q-fabius-labeo-denarius__r__src-the-coin-cabinet",
    imageLinkSketch:
      "20250911__q-fabius-labeo-denarius__r__src-the-coin-cabinet",
    legendExpanded: "Q(uintus) Fabi(us)",
    legendTranslation: "",
    description:
      "Jupiter driving galloping quadriga right, holding reins and sceptre and throwing thunderbolt; prow of galley below, Q•FABI in exergue.",
  },
}

export const FaustinaWithAltlight: Story = {
  args: {
    side: "obverse",
    imageLink: "20250714__faustina-ii-denarius__o__src-imperial-numismatics",
    imageLinkAltlight:
      "20250714__faustina-ii-denarius__o__src-imperial-numismatics",
    legendExpanded: "FAVSTINA AVGVSTA",
    legendTranslation: "Faustina Augusta",
    description:
      "Draped bust right, bare-headed, hair waved and fastened in a bun on back of head.",
  },
}

export const SestertiusWithAllImages: Story = {
  args: {
    side: "reverse",
    imageLink: "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
    imageLinkAltlight:
      "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
    imageLinkSketch:
      "20250820__faustina-ii-sestertius__r__src-imperial-numismatics",
    legendExpanded: "DIANA LVCIF S C",
    legendTranslation: "Diana Lucifera, by decree of the Senate",
    description:
      "Diana, draped, standing front, head left, holding transverse lighted torch in both hands.",
  },
}

export const MinimalExample: Story = {
  args: {
    side: "obverse",
    imageLink: "20250714__faustina-ii-denarius__o__src-imperial-numismatics",
    legendExpanded: "FAVSTINA AVGVSTA",
    description:
      "Draped bust right, bare-headed, hair waved and fastened in a bun on back of head.",
  },
}
