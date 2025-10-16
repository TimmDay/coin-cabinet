import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoinSnapshot } from "../components/ui/CoinSnapshot"

const meta = {
  title: "Components/CoinSnapshot",
  component: CoinSnapshot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    civ: {
      control: "text",
      description: "Civilization name",
    },
    civSpecific: {
      control: "text",
      description: "Specific civilization variant",
    },
    mint: {
      control: "text",
      description: "Mint location",
    },
    mintYearEarliest: {
      control: "number",
      description: "Earliest mint year",
    },
    mintYearLatest: {
      control: "number",
      description: "Latest mint year",
    },
    diameter: {
      control: "number",
      description: "Coin diameter in mm",
    },
    mass: {
      control: "number",
      description: "Coin mass in grams",
    },
    dieAxis: {
      control: "text",
      description: "Die axis orientation",
    },
    reference: {
      control: "text",
      description: "Catalog reference",
    },
    provenance: {
      control: "text",
      description: "Coin provenance",
    },
  },
} satisfies Meta<typeof CoinSnapshot>

export default meta
type Story = StoryObj<typeof meta>

// Complete Roman Republican coin example
export const RomanRepublican: Story = {
  args: {
    civ: "roman republic",
    civSpecific: "Sicily",
    mint: "Rome",
    mintYearEarliest: -102,
    mintYearLatest: -101,
    diameter: 19,
    mass: 3.8,
    dieAxis: "6h",
    reference: "Crawford 374/1",
    provenance: "Ex NAC 2019, lot 245",
  },
}

// Roman Imperial coin with year range
export const RomanImperial: Story = {
  args: {
    civ: "roman",
    civSpecific: "imperial",
    mint: "Alexandria",
    mintYearEarliest: 98,
    mintYearLatest: 117,
    diameter: 25,
    mass: 12.2,
    dieAxis: "12h",
    reference: "RIC II 456",
  },
}

// Greek city-state coin
export const Greek: Story = {
  args: {
    civ: "greek",
    mint: "Athens",
    mintYearEarliest: -440,
    mintYearLatest: -430,
    diameter: 17,
    mass: 17.2,
    dieAxis: "3h",
    reference: "Kroll 8",
    provenance: "Ex Gorny & Mosch 2020",
  },
}

// Minimal data example
export const Minimal: Story = {
  args: {
    civ: "celtic",
    mint: "Uncertain",
    mintYearEarliest: -50,
    mintYearLatest: -1,
    reference: "ABC 1234",
  },
}

// Single year example
export const SingleYear: Story = {
  args: {
    civ: "roman",
    civSpecific: "imperial",
    mint: "Rome",
    mintYearEarliest: 161,
    mintYearLatest: 161,
    diameter: 27,
    mass: 25.5,
    dieAxis: "6h",
    reference: "RIC III 1018",
    provenance: "Ex CNG 2018, lot 1423",
  },
}

// No specifications
export const NoSpecs: Story = {
  args: {
    civ: "byzantine",
    mint: "Constantinople",
    mintYearEarliest: 1042,
    mintYearLatest: 1055,
    reference: "DOC 3",
  },
}
