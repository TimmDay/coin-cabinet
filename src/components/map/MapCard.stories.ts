import type { Meta, StoryObj } from "@storybook/nextjs"
import { MapCard } from "./MapCard"

const meta: Meta<typeof MapCard> = {
  title: "Map/MapCard",
  component: MapCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title/heading of the card",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle or secondary information",
    },
    description: {
      control: "text",
      description: "Main description or content",
    },
    notes: {
      control: "text",
      description: "Additional notes or contextual information",
    },
    className: {
      control: "text",
      description: "Custom CSS class for styling variants",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const SimpleProvince: Story = {
  args: {
    title: "Gallia Narbonensis",
    description: "Roman Province",
    className: "text-emerald-800",
  },
}

export const DetailedProvince: Story = {
  args: {
    title: "Gallia Narbonensis",
    subtitle: "Modern: Southern France",
    details: [
      { label: "Capital", value: "Narbo Martius" },
      { label: "Governor", value: "Proconsul" },
      { label: "Established", value: "121 BCE" },
    ],
    notes:
      "The first Roman province established in Transalpine Gaul, serving as a crucial link between Italy and Hispania.",
  },
}

export const EmpireExtent: Story = {
  args: {
    title: "Roman Empire AD 117",
    description:
      "Greatest extent of the Roman Empire under Emperor Trajan, including recent conquests in Dacia and Mesopotamia.",
  },
}

export const HistoricalPeriod: Story = {
  args: {
    title: "Roman Republic 60 BCE",
    description:
      "The Roman Republic at the time of the First Triumvirate between Caesar, Pompey, and Crassus.",
    details: [
      { label: "Government", value: "Republic" },
      { label: "Consuls", value: "Caesar & Bibulus" },
      { label: "Major Events", value: "Gallic Wars beginning" },
    ],
  },
}

export const WithCustomStyling: Story = {
  args: {
    title: "Custom Styled Card",
    description: "Example with custom CSS classes",
    className: "bg-blue-50 border border-blue-200 rounded-lg",
    details: [
      { label: "Style", value: "Custom blue theme" },
      { label: "Usage", value: "Special highlighting" },
    ],
  },
}
