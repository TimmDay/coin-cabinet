import { NextResponse } from "next/server"
import { createClient } from "~/database/supabase-server"

export async function GET(_request: Request) {
  try {
    console.log("🚀 GET /api/deities - Fetching deities (public access)")

    // Use server client but don't require authentication for GET
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("deities")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      const errorResponse = NextResponse.json(
        {
          success: false,
          message: "Failed to fetch deities",
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

    console.log(`📋 Found ${data.length} deities`)

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
    console.error("Error fetching deities:", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Failed to fetch deities",
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
