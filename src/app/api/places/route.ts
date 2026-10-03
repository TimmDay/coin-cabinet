import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchPlaces } from "~/database/queries/places"

export const GET = publicRoute("places", fetchPlaces)
