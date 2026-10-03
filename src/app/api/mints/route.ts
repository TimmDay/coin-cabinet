import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchMints } from "~/database/queries/mints"

export const GET = publicRoute("mints", fetchMints)
