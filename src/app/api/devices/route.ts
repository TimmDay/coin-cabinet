import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchDevices } from "~/database/queries/devices"

// Not `fetchDevices` itself: the route's context must not arrive as its ids
export const GET = publicRoute("devices", (supabase) => fetchDevices(supabase))
