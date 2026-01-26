import type { Event as TimelineEvent } from "../../../data/timelines/types"

export type MarkerProps = {
  year: number
  event: TimelineEvent
  onEventClick: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  onEventKeyDown?: (event: TimelineEvent, e: React.KeyboardEvent) => void
  tabIndex?: number
  isSelected?: boolean
}

export type SideLineMarkerProps = {
  event: TimelineEvent
  position?: "start" | "end" // New prop to control positioning
  onEventClick: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  onEventKeyDown?: (event: TimelineEvent, e: React.KeyboardEvent) => void
  tabIndex?: number
  isSelected?: boolean
}

export type StackedMarkersProps = {
  year: number
  events: TimelineEvent[]
  onEventClick: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  onEventKeyDown?: (event: TimelineEvent, e: React.KeyboardEvent) => void
  getEventTabIndex?: (event: TimelineEvent) => number
  selectedEventIndex?: number
  allEventsChronological?: TimelineEvent[]
}

export type InvertedStackedMarkersProps = StackedMarkersProps
