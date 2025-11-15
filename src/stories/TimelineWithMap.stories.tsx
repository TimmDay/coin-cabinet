import type { Meta, StoryObj } from "@storybook/nextjs"
import philipTimeline from "~/components/map/timelines/philipI"
import { TimelineWithMap } from "~/components/map/TimelineWithMap"

const meta: Meta<typeof TimelineWithMap> = {
  title: "Combined/Timeline with Map",
  component: TimelineWithMap,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mt-32">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    timeline: {
      description:
        "Timeline data containing events with optional lat/lng coordinates",
    },
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
    initialCenter: {
      description: "Initial map center [latitude, longitude]",
      control: { type: "object" },
    },
    initialZoom: {
      description: "Initial map zoom level",
      control: { type: "range", min: 3, max: 18, step: 1 },
    },
    eventZoomLevel: {
      description: "Zoom level when focusing on timeline events",
      control: { type: "range", min: 4, max: 15, step: 1 },
    },
    showAD117: {
      description: "Show AD 117 Roman Empire extent",
      control: "boolean",
    },
    showProvinceLabels: {
      description: "Show province name labels on map",
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof TimelineWithMap>

export const PhilipITimelineWithMap: Story = {
  args: {
    timeline: philipTimeline,
    className: "w-full",
    initialCenter: [41.9028, 12.4964], // Rome
    initialZoom: 5,
    eventZoomLevel: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Philip I's timeline combined with an interactive map. Click timeline markers to see the map fly to event locations.",
      },
    },
  },
}

// Create a test timeline with specific coordinates
const interactiveTimeline = {
  id: "interactive-test",
  events: [
    {
      kind: "birth" as const,
      name: "Born in Shahba",
      year: 204,
      description: "Born in Shahba, later renamed Philippopolis",
      place: "Shahba",
      lat: 32.8167,
      lng: 36.8167,
    },
    {
      kind: "political" as const,
      name: "Made Emperor in Mesopotamia",
      year: 244,
      description: "Proclaimed emperor by troops near the frontier",
      place: "Mesopotamian frontier",
      lat: 34.81,
      lng: 41.19,
    },
    {
      kind: "other" as const,
      name: "Millennium Games in Rome",
      year: 248,
      description: "Hosted Rome's 1000th anniversary celebration",
      place: "Rome",
      lat: 41.9028,
      lng: 12.4964,
    },
    {
      kind: "death" as const,
      name: "Died in Verona",
      year: 249,
      description: "Killed in battle against Decius",
      place: "Verona",
      lat: 45.4384,
      lng: 10.9916,
    },
  ],
}

export const InteractiveTest: Story = {
  args: {
    timeline: interactiveTimeline,
    className: "w-full",
    initialCenter: [38.0, 25.0], // Mediterranean center
    initialZoom: 4,
    eventZoomLevel: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A test timeline with events across the Roman Empire to demonstrate map interaction. Click each timeline marker to see the map fly to that location.",
      },
    },
  },
}

// Create a timeline without large gaps (no sideline marker)
const compactTimeline = {
  id: "compact-timeline",
  events: [
    {
      kind: "political" as const,
      name: "Consul I",
      year: 244,
      description: "First consulship appointment",
      place: "Rome",
      lat: 41.9028,
      lng: 12.4964,
    },
    {
      kind: "military" as const,
      name: "Campaign in Gaul",
      year: 246,
      description: "Military campaign in Gaul",
      place: "Lugdunum",
      lat: 45.764,
      lng: 4.8357,
    },
    {
      kind: "political" as const,
      name: "Consul II",
      year: 247,
      description: "Second consulship",
      place: "Rome",
      lat: 41.9028,
      lng: 12.4964,
    },
    {
      kind: "other" as const,
      name: "Games",
      year: 248,
      description: "Hosted public games",
      place: "Rome",
      lat: 41.9028,
      lng: 12.4964,
    },
    {
      kind: "military" as const,
      name: "Final Battle",
      year: 249,
      description: "Final military engagement",
      place: "Verona",
      lat: 45.4384,
      lng: 10.9916,
    },
  ],
}

export const CompactTimeline: Story = {
  args: {
    timeline: compactTimeline,
    className: "w-full",
    initialCenter: [45.0, 10.0], // Northern Italy
    initialZoom: 5,
    eventZoomLevel: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A compact timeline with no large gaps between events, demonstrating full-width layout without sideline markers.",
      },
    },
  },
}
