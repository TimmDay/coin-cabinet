import { publicRoute, PublicRouteError } from "~/app/api/_lib/public-route"
import { fetchCollectionDetail } from "~/database/queries/collection"

export const GET = publicRoute(
  "coin",
  async (supabase, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    // Digits only: `parseInt` would take "12abc" as 12.
    if (!/^[1-9]\d{0,9}$/.test(id)) {
      throw new PublicRouteError("Invalid coin id", 400)
    }
    return fetchCollectionDetail(supabase, Number(id))
  },
)
