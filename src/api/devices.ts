import { createPublicQuery, STALE } from "~/api/public-query"
import type { Device } from "~/database/schema-devices"

export const useDevices = createPublicQuery<Device[]>({
  key: ["devices"],
  path: "/api/devices",
  label: "devices",
  staleTime: STALE.week,
})
