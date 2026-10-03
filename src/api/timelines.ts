import { createPublicQuery, STALE } from "~/api/public-query"
import type { Timeline } from "~/database/schema-timelines"

export const useTimelines = createPublicQuery<Timeline[]>({
  key: ["timelines"],
  path: "/api/timelines",
  label: "timelines",
  staleTime: STALE.fiveMinutes,
})
