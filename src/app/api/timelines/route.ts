import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchTimelines } from "~/database/queries/timelines"

export const GET = publicRoute("timelines", fetchTimelines, { cache: true })
