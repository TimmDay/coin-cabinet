import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

type UpdateData = {
  nickname?: string
  legend_o?: string | null
  legend_o_expanded?: string | null
  legend_o_translation?: string | null
  desc_o?: string | null
  legend_r?: string | null
  legend_r_expanded?: string | null
  legend_r_translation?: string | null
  desc_r?: string | null
  flavour_text?: string | null
  godName?: string | null
  devices?: string[] | null
  sets?: string[] | null
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op for server client
          },
        },
      },
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Await params in Next.js 15
    const { id } = await params

    // Parse the request body and filter out undefined values
    const body = (await request.json()) as UpdateData
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined),
    )

    // Update the item in the database using Supabase client (respects RLS)
    const { data: updatedItems, error: updateError } = await supabase
      .from("somnus_collection")
      .update(updateData)
      .eq("id", parseInt(id))
      .eq("user_id", user.id)
      .select()

    if (updateError) {
      console.error("Supabase update error:", updateError)
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    if (!updatedItems || updatedItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found or you do not have permission to update it",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Item updated successfully",
      data: (updatedItems as unknown[])?.[0] ?? null,
    })
  } catch (error) {
    console.error("Error updating somnus collection item:", error)

    // Provide more specific error information in development
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
        // Include error details in development only
        ...(process.env.NODE_ENV !== "production" && {
          error: error instanceof Error ? error.stack : String(error),
        }),
      },
      { status: 500 },
    )
  }
}
