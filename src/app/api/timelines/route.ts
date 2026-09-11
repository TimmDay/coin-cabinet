import { NextResponse } from "next/server"
import { fetchTimelines } from "~/database/queries/timelines"
import { createClient } from "~/database/supabase-server"

export async function GET(_request: Request) {
  try {
    console.log("🚀 GET /api/timelines - Fetching timelines (public access)")

    // Use server client but don't require authentication for GET
    const supabase = await createClient()

    const { data, error } = await fetchTimelines(supabase)

    if (error) {
      console.error("Supabase error:", error)
      const errorResponse = NextResponse.json(
        {
          success: false,
          message: "Failed to fetch timelines",
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

    console.log(`📋 Found ${data.length} timelines`)

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
    console.error("Error fetching timelines:", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Failed to fetch timelines",
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
