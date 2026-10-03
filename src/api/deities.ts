"use client"

import { createPublicQuery, STALE } from "~/api/public-query"
import type { Deity } from "~/database/schema-deities"

export const useDeities = createPublicQuery<Deity[]>({
  key: ["deities"],
  path: "/api/deities",
  label: "deities",
  staleTime: STALE.week,
})
