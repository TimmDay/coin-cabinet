import { createPublicQuery, STALE } from "~/api/public-query"
import type { Place } from "~/database/schema-places"

export const usePlaces = createPublicQuery<Place[]>({
  key: ["places"],
  path: "/api/places",
  label: "places",
  staleTime: STALE.week,
})
