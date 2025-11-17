import aquiliaSeveraTimeline from "./aquiliaSevera"
import macrinusTimeline from "./macrinus"
import philipTimeline from "./philipI"

export const TIMELINES = {
  "philip-i": philipTimeline,
  macrinus: macrinusTimeline,
  "aquilia-severa": aquiliaSeveraTimeline,
} as const

export type TimelineId = keyof typeof TIMELINES
