import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchDevices } from "~/database/queries/devices"

export const GET = publicRoute("devices", fetchDevices)
