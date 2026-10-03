import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchDeities } from "~/database/queries/deities"

export const GET = publicRoute("deities", fetchDeities, { cache: true })
