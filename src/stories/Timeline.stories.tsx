import type { Meta, StoryObj } from "@storybook/nextjs"
import { Timeline } from "~/components/ui/Timeline"

// Sample timeline data for stories
const philipTimeline = [
  {
    kind: "birth" as const,
    name: "Born",
    year: 204,
    description: "Born in Shahba, later renamed Philippopolis",
    source: "",
    place: "Shahba",
    lat: 32.8167,
    lng: 36.8167,
  },
  {
    kind: "made-emperor" as const,
    name: "Made Emperor",
    year: 244,
    description: "Proclaimed emperor by troops after Gordian III's death",
    source: "",
    place: "Mesopotamian frontier",
    lat: 34.81,
    lng: 41.19,
  },
  {
    kind: "death" as const,
    name: "Died in Battle",
    year: 249,
    description: "Killed in battle against Decius at Verona",
    source: "",
    place: "Verona",
    lat: 45.4384,
    lng: 10.9916,
  },
]

const meta: Meta<typeof Timeline> = {
  title: "UI/Timeline",
  component: Timeline,
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
      description: "Timeline data containing events to display",
    },
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
  },
}

export default meta
type Story = StoryObj<typeof Timeline>

export const PhilipITimeline: Story = {
  args: {
    timeline: philipTimeline,
    className: "w-full",
  },
}

export const PhilipITimelineCompact: Story = {
  args: {
    timeline: philipTimeline,
    className: "w-full max-w-4xl mx-auto",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A more compact version of Philip I's timeline with constrained width.",
      },
    },
  },
}

// Create a simplified timeline for testing
const simpleTimeline = [
  {
    kind: "birth" as const,
    name: "Born",
    year: 200,
    description: "A simple birth event for testing the timeline component.",
    source: "",
  },
  {
    kind: "political" as const,
    name: "Became Emperor",
    year: 220,
    description:
      "Ascended to the throne after a series of political maneuvers.",
    source: "",
  },
  {
    kind: "death" as const,
    name: "Died",
    year: 235,
    description: "Died in battle defending the empire.",
    source: "",
  },
]

export const SimpleTimeline: Story = {
  args: {
    timeline: simpleTimeline,
    className: "w-full",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A simplified timeline with just three events to showcase the basic functionality.",
      },
    },
  },
}
