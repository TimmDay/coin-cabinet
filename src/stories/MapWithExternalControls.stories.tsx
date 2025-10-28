import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Map } from "../components/map/Map"
import { MapControls } from "../components/map/MapControls"

// Combined component for Storybook
function MapWithControls() {
  const [showBC60, setShowBC60] = useState(false)
  const [showAD14, setShowAD14] = useState(false)
  const [showAD69, setShowAD69] = useState(false)
  const [showAD117, setShowAD117] = useState(false)
  const [showAD200, setShowAD200] = useState(false)
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [showProvinceLabels, setShowProvinceLabels] = useState(true)

  return (
    <div className="flex h-screen flex-col">
      {/* Map Controls */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 p-4">
        <MapControls
          showBC60={showBC60}
          onBC60Change={setShowBC60}
          showAD14={showAD14}
          onAD14Change={setShowAD14}
          showAD69={showAD69}
          onAD69Change={setShowAD69}
          showAD117={showAD117}
          onAD117Change={setShowAD117}
          showAD200={showAD200}
          onAD200Change={setShowAD200}
          selectedProvinces={selectedProvinces}
          onProvincesChange={setSelectedProvinces}
          showProvinceLabels={showProvinceLabels}
          onProvinceLabelsChange={setShowProvinceLabels}
        />
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <div className="h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
          <Map
            height="100%"
            hideControls={true}
            showBC60={showBC60}
            showAD14={showAD14}
            showAD69={showAD69}
            showAD117={showAD117}
            showAD200={showAD200}
            selectedProvinces={selectedProvinces}
            showProvinceLabels={showProvinceLabels}
          />
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: "Examples/MapWithExternalControls",
  component: MapWithControls,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Example of using Map with external MapControls component. This demonstrates the pattern used in the /map page where controls are separated from the map for better layout control and dropdown visibility.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MapWithControls>

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {}

// With controls at bottom (like the actual map page)
function MapWithControlsBelow() {
  const [showBC60, setShowBC60] = useState(false)
  const [showAD14, setShowAD14] = useState(false)
  const [showAD69, setShowAD69] = useState(false)
  const [showAD117, setShowAD117] = useState(false)
  const [showAD200, setShowAD200] = useState(false)
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [showProvinceLabels, setShowProvinceLabels] = useState(true)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Page Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Interactive Map</h1>
        <p className="mt-2 text-gray-600">
          Explore the Roman Empire with our interactive historical map
        </p>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-140px)] flex-shrink-0">
        <div className="h-full p-4">
          <div className="h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
            <Map
              height="100%"
              hideControls={true}
              showBC60={showBC60}
              showAD14={showAD14}
              showAD69={showAD69}
              showAD117={showAD117}
              showAD200={showAD200}
              selectedProvinces={selectedProvinces}
              showProvinceLabels={showProvinceLabels}
            />
          </div>
        </div>
      </div>

      {/* Map Controls at Bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-4">
        <MapControls
          showBC60={showBC60}
          onBC60Change={setShowBC60}
          showAD14={showAD14}
          onAD14Change={setShowAD14}
          showAD69={showAD69}
          onAD69Change={setShowAD69}
          showAD117={showAD117}
          onAD117Change={setShowAD117}
          showAD200={showAD200}
          onAD200Change={setShowAD200}
          selectedProvinces={selectedProvinces}
          onProvincesChange={setSelectedProvinces}
          showProvinceLabels={showProvinceLabels}
          onProvinceLabelsChange={setShowProvinceLabels}
        />
      </div>
    </div>
  )
}

export const ControlsBelow: StoryObj<typeof MapWithControlsBelow> = {
  render: () => <MapWithControlsBelow />,
}
