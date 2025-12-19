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
  onEventFocus?: (event: TimelineEvent, element: HTMLElement) => void
  onEventBlur?: () => void
  onEventKeyDown?: (event: TimelineEvent, e: React.KeyboardEvent) => void
  tabIndex?: number
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
  onEventFocus?: (event: TimelineEvent, element: HTMLElement) => void
  onEventBlur?: () => void
  onEventKeyDown?: (event: TimelineEvent, e: React.KeyboardEvent) => void
  tabIndex?: number
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
  onEventFocus?: (event: TimelineEvent, element: HTMLElement) => void
  onEventBlur?: () => void
  onEventKeyDown?: (event: TimelineEvent, e: React.KeyboardEvent) => void
  getEventTabIndex?: (event: TimelineEvent) => number
}

export type InvertedStackedMarkersProps = StackedMarkersProps
