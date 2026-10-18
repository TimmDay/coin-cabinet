import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchPlaces } from "~/database/queries/places"

// Not `fetchPlaces` itself: the route's context must not arrive as its ids
export const GET = publicRoute("places", (supabase) => fetchPlaces(supabase), {
  cache: true,
})
