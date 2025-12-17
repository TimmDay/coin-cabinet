// Re-export all timeline marker components from the new modular structure
export {
  NormalMarker,
  InvertedMarker,
  StackedMarkers,
  InvertedStackedMarkers,
  SideLineMarker,
  EventLogo,
  processTextForSmartWrapping,
  willTextWrap,
} from "./timeline-markers"

export type {
  MarkerProps,
  SideLineMarkerProps,
  StackedMarkersProps,
  InvertedStackedMarkersProps,
} from "./timeline-markers"
