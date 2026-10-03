"use client"

import { createPublicQuery, STALE } from "~/api/public-query"
import type { Mint } from "~/database/schema-mints"

export const useMints = createPublicQuery<Mint[]>({
  key: ["mints"],
  path: "/api/mints",
  label: "mints",
  staleTime: STALE.week,
})
