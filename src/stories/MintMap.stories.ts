import type { Meta, StoryObj } from "@storybook/nextjs"
import { MintMap } from "../components/ui/MintMap"

const meta = {
  title: "Components/MintMap",
  component: MintMap,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A map component for displaying ancient Roman Empire territories and mint locations. Uses Leaflet with OpenStreetMap tiles and a muted color scheme. Map bounds are set to cover the Roman Empire with a 500km buffer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    center: {
      description: "Center coordinates of the map [latitude, longitude]",
      control: { type: "object" },
    },
    zoom: {
      description: "Zoom level of the map",
      control: { type: "range", min: 3, max: 18, step: 1 },
    },
    height: {
      description: "Height of the map container",
      control: { type: "text" },
    },
    width: {
      description: "Width of the map container",
      control: { type: "text" },
    },
    className: {
      description: "Additional CSS class names",
      control: { type: "text" },
    },
    showAD200: {
      description: "Show AD 200 empire extent layer (legacy)",
      control: { type: "boolean" },
    },
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
  },
} satisfies Meta<typeof MintMap>

export default meta
type Story = StoryObj<typeof meta>

// Default story - Roman Empire overview
export const Default: Story = {
  args: {
    center: [41.0, 21.0], // Balkans - center of Roman Empire
    zoom: 4,
    height: "400px",
    width: "100%",
  },
}

// With historical boundaries
export const WithBoundaries: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "trajan",
    showBoundaries: true,
  },
}

// Early Roman Republic
export const EarlyRepublic: Story = {
  args: {
    center: [41.9028, 12.4964], // Rome
    zoom: 6,
    height: "400px",
    width: "100%",
    selectedPeriod: "early-republic",
    showBoundaries: true,
  },
}

// Late Roman Republic
export const LateRepublic: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "late-republic",
    showBoundaries: true,
  },
}

// Trajan's Empire at greatest extent
export const TrajanEmpire: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "trajan",
    showBoundaries: true,
  },
}

// Septimius Severus early reign
export const SeverusEarlyReign: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "severus-early",
    showBoundaries: true,
  },
}

// Septimius Severus late reign with provincial divisions
export const SeverusLateReign: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "severus-late",
    showBoundaries: true,
  },
}

// Different regions within the Roman Empire
export const Rome: Story = {
  args: {
    center: [41.9028, 12.4964], // Rome, Italy
    zoom: 6,
    height: "400px",
    width: "100%",
  },
}

export const Gaul: Story = {
  args: {
    center: [46.2276, 2.2137], // France (Gaul)
    zoom: 6,
    height: "400px",
    width: "100%",
  },
}

export const Hispania: Story = {
  args: {
    center: [40.4637, -3.7492], // Spain (Hispania)
    zoom: 6,
    height: "400px",
    width: "100%",
  },
}

export const Britannia: Story = {
  args: {
    center: [54.7023, -3.2765], // Britain (Britannia)
    zoom: 6,
    height: "400px",
    width: "100%",
  },
}

export const Egypt: Story = {
  args: {
    center: [30.0444, 31.2357], // Cairo, Egypt
    zoom: 6,
    height: "400px",
    width: "100%",
  },
}

export const Asia: Story = {
  args: {
    center: [38.9637, 35.2433], // Turkey (Asia Minor)
    zoom: 6,
    height: "400px",
    width: "100%",
  },
}

// Different sizes
export const Tall: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "600px",
    width: "100%",
  },
}

export const Square: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "400px",
  },
}

export const Compact: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 5,
    height: "300px",
    width: "100%",
  },
}

// Zoom levels
export const ZoomedOut: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 3,
    height: "400px",
    width: "100%",
  },
}

export const ZoomedIn: Story = {
  args: {
    center: [41.9028, 12.4964], // Rome
    zoom: 10,
    height: "400px",
    width: "100%",
  },
}

// Without boundaries - clean map
export const NoBoundaries: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showBoundaries: false,
  },
}

// AD 200 Empire Extent
export const AD200Extent: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showBoundaries: false,
    showAD200: true,
  },
}

// AD 200 with Severan boundaries
export const AD200WithSeveranBoundaries: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "severus-late",
    showBoundaries: true,
    showAD200: true,
  },
}

// New Empire Extent Layer Stories

// Interactive Empire Layers (uncontrolled - use buttons to toggle)
export const InteractiveEmpireLayers: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    // No empireExtentLayers prop - use buttons to control layers
  },
}

// Single Empire Extent Layer - BC 60
export const EmpireExtentBC60: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showBC60: true,
  },
}

// Single Empire Extent Layer - AD 14 (Augustus death)
export const EmpireExtentAD14: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showAD14: true,
  },
}

// Single Empire Extent Layer - AD 69 (Year of Four Emperors)
export const EmpireExtentAD69: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showAD69: true,
  },
}

// Single Empire Extent Layer - AD 117 (Trajan's greatest extent)
export const EmpireExtentAD117: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showAD117: true,
  },
}

// Single Empire Extent Layer - AD 200 (new system)
export const EmpireExtentAD200New: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showAD200: true,
  },
}

// Multiple Empire Extent Layers - Evolution over time
export const EmpireExtentEvolution: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showBC60: true,
    showAD14: true,
    showAD117: true,
  },
}

// All Empire Extent Layers
export const AllEmpireExtentLayers: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showBC60: true,
    showAD14: true,
    showAD69: true,
    showAD117: true,
    showAD200: true,
  },
}

// Empire Extent with Boundaries - comparing territorial control vs administrative divisions
export const EmpireExtentWithBoundaries: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    selectedPeriod: "trajan",
    showBoundaries: true,
    showAD117: true,
  },
}

// Comparative view: Late Republic vs Early Empire
export const RepublicToEmpireComparison: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showBC60: true,
    showAD14: true,
  },
}

// Peak Empire vs Later Empire
export const PeakVsLaterEmpire: Story = {
  args: {
    center: [41.0, 21.0],
    zoom: 4,
    height: "400px",
    width: "100%",
    showAD117: true,
    showAD200: true,
  },
}
