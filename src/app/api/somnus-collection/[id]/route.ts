import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { fetchCollectionDetail } from "~/database/queries/collection"
import { createClient } from "~/database/supabase-server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Public supabase client (no authentication required for GET)
    const supabase = await createClient()

    // Await params in Next.js 15
    const { id } = await params

    // `?include=deities,historical-figures` and `showHidden` are kept as
    // accepted params for API-shape compatibility, but are now no-ops:
    // deities/historical figures are always included (cheap now that
    // they're targeted joins, not a second round trip), and anon RLS
    // already excludes hidden/unconfirmed items regardless of `showHidden`
    // (see docs/SCHEMA_MIGRATION_READ_PATH.md).
    const { data: coinWithDeities, error } = await fetchCollectionDetail(
      supabase,
      parseInt(id),
    )

    if (error) {
      console.error("Supabase coin fetch error:", error)
      throw new Error(`Database fetch failed: ${error.message}`)
    }

    if (!coinWithDeities) {
      return NextResponse.json(
        { success: false, message: "Coin not found" },
        { status: 404 },
      )
    }

    console.log(`Coin ${id} - Basic data:`, {
      id: coinWithDeities.id,
      nickname: coinWithDeities.nickname,
      deity_id: coinWithDeities.deity_id,
      historical_figures_id: coinWithDeities.historical_figures_id,
    })

    return NextResponse.json({
      success: true,
      data: coinWithDeities,
    })
  } catch (error) {
    console.error("Error fetching coin:", error)

    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        ...(process.env.NODE_ENV !== "production" && {
          error: error instanceof Error ? error.stack : String(error),
        }),
      },
      { status: 500 },
    )
  }
}
