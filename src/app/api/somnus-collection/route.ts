import { NextResponse } from "next/server"
import { fetchCollectionList } from "~/database/queries/collection"
import { createClient } from "~/database/supabase-server"

export async function GET(_request: Request) {
  try {
    console.log(
      "🚀 GET /api/somnus-collection - Fetching coins (public access)",
    )

    // Use server client but don't require authentication for GET
    const supabase = await createClient()

    // `includeAll`/`showHidden` are no longer meaningful here: anon RLS on
    // `public_items` already excludes hidden/unconfirmed items regardless of
    // these params (see docs/SCHEMA_MIGRATION_READ_PATH.md). Only images
    // already come pre-filtered to what's public, matching the old route's
    // "obverse image required" behavior naturally (a coin without a
    // `coin_images` standard-obverse row just has `image_link_o: null`, same
    // shape as before).
    const { data, error } = await fetchCollectionList(supabase)

    if (error) {
      console.error("Supabase error:", error)
      const errorResponse = NextResponse.json(
        {
          success: false,
          message: "Failed to fetch somnus coins",
          error: error.message,
        },
        { status: 500 },
      )

      // Don't cache error responses
      errorResponse.headers.set(
        "Cache-Control",
        "no-cache, no-store, must-revalidate",
      )
      return errorResponse
    }

    console.log(`📋 Found ${data.length} coins with obverse images`)

    const response = NextResponse.json({
      success: true,
      data,
    })

    // Add HTTP caching headers for persistent cross-session caching
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=86400",
    )
    response.headers.set("CDN-Cache-Control", "public, max-age=86400")

    return response
  } catch (error: unknown) {
    console.error("Error fetching somnus coins:", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Failed to fetch somnus coins",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )

    // Don't cache error responses
    errorResponse.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    )
    return errorResponse
  }
}

export async function DELETE(request: Request) {
  try {
    // Use server client for authenticated requests
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Parse request body
    const body = (await request.json()) as { id?: number }
    const { id } = body

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid id is required" },
        { status: 400 },
      )
    }

    // Delete somnus coin
    const { error } = await supabase
      .from("somnus_collection")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete somnus coin",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Somnus coin deleted successfully!",
    })
  } catch (error: unknown) {
    console.error("Error deleting somnus coin:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete somnus coin",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
