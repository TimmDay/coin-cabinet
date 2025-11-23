import aquiliaSeveraTimeline from "./aquiliaSevera"
import firstjewishWarTimeline from "./firstJewishWar"
import macrinusTimeline from "./macrinus"
import philipTimeline from "./philipI"

export const TIMELINES = {
  "philip-i": philipTimeline,
  macrinus: macrinusTimeline,
  "aquilia-severa": aquiliaSeveraTimeline,
  "first-jewish-war": firstjewishWarTimeline,
} as const

export type TimelineId = keyof typeof TIMELINES
