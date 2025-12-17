import type { Event as TimelineEvent } from "../../../data/timelines/types"

export type MarkerProps = {
  year: number
  event: TimelineEvent
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventClick: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  onEventLeave: () => void
}

export type SideLineMarkerProps = {
  event: TimelineEvent
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventClick: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  onEventLeave: () => void
}

export type StackedMarkersProps = {
  year: number
  events: TimelineEvent[]
  onEventInteraction: (
    event: TimelineEvent,
    clientX: number,
    clientY: number,
  ) => void
  onEventClick: (
    event: TimelineEvent,
    clientX?: number,
    clientY?: number,
  ) => void
  onEventLeave: () => void
}

export type InvertedStackedMarkersProps = StackedMarkersProps