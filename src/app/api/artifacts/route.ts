import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchArtifacts } from "~/database/queries/artifacts"

export const GET = publicRoute("artifacts", fetchArtifacts)
