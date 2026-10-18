import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchArtifacts } from "~/database/queries/artifacts"

// Not `fetchArtifacts` itself: the route's context must not arrive as its ids
export const GET = publicRoute("artifacts", (supabase) =>
  fetchArtifacts(supabase),
)
