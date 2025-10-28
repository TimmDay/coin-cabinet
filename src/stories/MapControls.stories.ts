import type { Meta, StoryObj } from "@storybook/nextjs"
import { MapControls } from "../components/map/MapControls"

const meta = {
  title: "Components/MapControls",
  component: MapControls,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "External map controls component that provides all interactive controls for the Map. Includes time period selection, empire extent layers, and province selection with multiselect dropdown.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    showBC60: {
      description: "Show BC 60 empire extent layer",
      control: { type: "boolean" },
    },
    showAD14: {
      description: "Show AD 14 empire extent layer",
      control: { type: "boolean" },
    },
    showAD69: {
      description: "Show AD 69 empire extent layer",
      control: { type: "boolean" },
    },
    showAD117: {
      description: "Show AD 117 empire extent layer",
      control: { type: "boolean" },
    },
    showAD200: {
      description: "Show AD 200 empire extent layer",
      control: { type: "boolean" },
    },
    selectedProvinces: {
      description: "Selected provinces array",
      control: { type: "object" },
    },
    showProvinceLabels: {
      description: "Show province labels on map",
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof MapControls>

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    selectedProvinces: [],
    showProvinceLabels: true,
    onProvincesChange: (provinces: string[]) => {
      console.log("Provinces changed:", provinces)
    },
    onProvinceLabelsChange: (show: boolean) => {
      console.log("Province labels:", show)
    },
  },
}

// With some provinces selected
export const WithProvincesSelected: Story = {
  args: {
    selectedProvinces: ["Gallia", "Hispania", "Britannia"],
    showProvinceLabels: true,
    onProvincesChange: (provinces: string[]) => {
      console.log("Provinces changed:", provinces)
    },
    onProvinceLabelsChange: (show: boolean) => {
      console.log("Province labels:", show)
    },
  },
}

// With empire layers active
export const WithSelectedEmpireLayers: Story = {
  args: {
    selectedProvinces: [],
    showProvinceLabels: true,
    showBC60: false,
    showAD14: true,
    showAD69: false,
    showAD117: true,
    showAD200: false,
    onProvincesChange: (provinces: string[]) => {
      console.log("Provinces changed:", provinces)
    },
    onProvinceLabelsChange: (show: boolean) => {
      console.log("Province labels:", show)
    },
  },
}

// With empire layers enabled
export const WithEmpireLayers: Story = {
  args: {
    showAD117: true,
    showAD14: true,
    selectedProvinces: ["Italia", "Gallia"],
    showProvinceLabels: true,
    onBC60Change: (show: boolean) => {
      console.log("BC60 layer:", show)
    },
    onAD14Change: (show: boolean) => {
      console.log("AD14 layer:", show)
    },
    onAD69Change: (show: boolean) => {
      console.log("AD69 layer:", show)
    },
    onAD117Change: (show: boolean) => {
      console.log("AD117 layer:", show)
    },
    onAD200Change: (show: boolean) => {
      console.log("AD200 layer:", show)
    },
    onProvincesChange: (provinces: string[]) => {
      console.log("Provinces changed:", provinces)
    },
    onProvinceLabelsChange: (show: boolean) => {
      console.log("Province labels:", show)
    },
  },
}

// Fully configured
export const FullyConfigured: Story = {
  args: {
    showAD117: true,
    showAD200: true,
    selectedProvinces: ["Italia", "Gallia", "Hispania", "Africa", "Aegyptus"],
    showProvinceLabels: true,
    onBC60Change: (show: boolean) => {
      console.log("BC60 layer:", show)
    },
    onAD14Change: (show: boolean) => {
      console.log("AD14 layer:", show)
    },
    onAD69Change: (show: boolean) => {
      console.log("AD69 layer:", show)
    },
    onAD117Change: (show: boolean) => {
      console.log("AD117 layer:", show)
    },
    onAD200Change: (show: boolean) => {
      console.log("AD200 layer:", show)
    },
    onProvincesChange: (provinces: string[]) => {
      console.log("Provinces changed:", provinces)
    },
    onProvinceLabelsChange: (show: boolean) => {
      console.log("Province labels:", show)
    },
  },
}
