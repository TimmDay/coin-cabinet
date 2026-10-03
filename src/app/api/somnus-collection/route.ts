import { publicRoute } from "~/app/api/_lib/public-route"
import { fetchCollectionList } from "~/database/queries/collection"

// Anon RLS on `public_items` already excludes hidden and unconfirmed items (see
// docs/READ_PATH.md), so there is nothing to filter here.
export const GET = publicRoute("coins", fetchCollectionList, { cache: true })
