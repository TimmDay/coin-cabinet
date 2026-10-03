import { createPublicQuery, STALE } from "~/api/public-query"
import type { Artifact } from "~/database/schema-artifacts"

export const useArtifacts = createPublicQuery<Artifact[]>({
  key: ["artifacts"],
  path: "/api/artifacts",
  label: "artifacts",
  staleTime: STALE.twoHours,
})
