import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchMints } from "~/database/queries/mints"

// Not `fetchMints` itself: the route's context must not arrive as its ids
export const GET = publicRoute("mints", (supabase) => fetchMints(supabase), {
  cache: true,
})
