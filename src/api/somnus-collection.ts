"use client"

import { createPublicQuery, STALE } from "~/api/public-query"
import type { SomnusCollection } from "~/database/schema-somnus-collection"

export const useSomnusCoins = createPublicQuery<SomnusCollection[]>({
  key: ["somnus-coins"],
  path: "/api/somnus-collection",
  label: "coins",
  staleTime: STALE.week,
})
