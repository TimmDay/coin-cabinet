import type { Meta, StoryObj } from "@storybook/nextjs"
import { ROMAN_TIME_PERIODS } from "../../data/romanBoundaries"
import { MapEmbeddedControls } from "./MapEmbeddedControls"

const empireLayerConfig = {
  bc60: { name: "60 BCE", description: "Roman Republic at the time of Caesar" },
  ad14: { name: "14 CE", description: "Death of Augustus" },
  ad69: { name: "69 CE", description: "Year of the Four Emperors" },
  ad117: { name: "117 CE", description: "Greatest extent under Trajan" },
  ad200: { name: "200 CE", description: "Height of the Principate" },
}

const provinceOptions = [
  { value: "gallia-narbonensis", label: "Gallia Narbonensis" },
  { value: "hispania-tarraconensis", label: "Hispania Tarraconensis" },
  { value: "africa-proconsularis", label: "Africa Proconsularis" },
  { value: "aegyptus", label: "Aegyptus" },
  { value: "syria", label: "Syria" },
  { value: "britannia", label: "Britannia" },
  { value: "dacia", label: "Dacia" },
  { value: "germania-inferior", label: "Germania Inferior" },
]

const meta: Meta<typeof MapEmbeddedControls> = {
  title: "Map/MapEmbeddedControls",
  component: MapEmbeddedControls,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "radio",
      options: ["default", "fullscreen"],
      description: "Layout style for the controls",
    },
    currentPeriod: {
      control: "select",
      options: [null, ...ROMAN_TIME_PERIODS.map((p) => p.id)],
      description: "Currently selected time period",
    },
    selectedProvinces: {
      control: "object",
      description: "Array of selected province IDs",
    },
    provincesLoading: {
      control: "boolean",
      description: "Whether provinces are currently loading",
    },
    showProvinceLabels: {
      control: "boolean",
      description: "Whether province labels are visible",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    layout: "default",
    timePeriods: ROMAN_TIME_PERIODS,
    currentPeriod: null,
    empireLayerConfig,
    isLayerVisible: () => false,
    toggleLayer: () => {
      /* Storybook action */
    },
    hasAnyEmpireLayerVisible: () => false,
    clearAllEmpireLayers: () => {
      /* Storybook action */
    },
    provinceOptions,
    selectedProvinces: [],
    onProvinceSelectionChange: () => {
      /* Storybook action */
    },
    provincesLoading: false,
    showProvinceLabels: true,
    onShowProvinceLabelsChange: () => {
      /* Storybook action */
    },
  },
}

export const FullscreenLayout: Story = {
  args: {
    ...Default.args,
    layout: "fullscreen",
  },
}

export const WithActiveSelections: Story = {
  args: {
    ...Default.args,
    currentPeriod: "ad117",
    isLayerVisible: (key: string) => key === "ad14" || key === "ad117",
    hasAnyEmpireLayerVisible: () => true,
    selectedProvinces: [
      "gallia-narbonensis",
      "hispania-tarraconensis",
      "aegyptus",
    ],
    showProvinceLabels: true,
  },
}

export const LoadingState: Story = {
  args: {
    ...Default.args,
    provincesLoading: true,
    provinceOptions: [],
  },
}

export const CompactWithSelections: Story = {
  args: {
    ...Default.args,
    layout: "default",
    currentPeriod: "ad69",
    selectedProvinces: ["britannia", "dacia"],
    showProvinceLabels: false,
  },
}
