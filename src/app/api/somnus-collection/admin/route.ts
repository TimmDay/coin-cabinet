import type { PostgrestSingleResponse } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { createClient } from "~/database/supabase-server"
import { coinFormSchema } from "~/lib/validations/coin-form"

export async function POST(request: Request) {
  try {
    console.log(
      "🚀 POST /api/somnus-collection/admin - Adding coin to collection",
    )

    // Use server client for authenticated requests
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    console.log("🔐 Auth check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      authError: authError?.message,
    })

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Parse and validate the request body
    const body: unknown = await request.json()
    console.log(
      "Received request body for somnus collection:",
      JSON.stringify(body, null, 2),
    )

    const validatedData = coinFormSchema.parse(body)
    console.log(
      "Validated data for somnus collection:",
      JSON.stringify(validatedData, null, 2),
    )

    // Insert the data into somnus_collection table with user_id
    const tableName = "somnus_collection"
    console.log("Using table:", tableName)

    // Add user_id to the validated data
    const dataWithUserId = {
      ...validatedData,
      user_id: session.user.id,
    }

    const result: PostgrestSingleResponse<Record<string, unknown>> =
      await supabase.from(tableName).insert(dataWithUserId).select().single()

    const { data, error } = result

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add coin to somnus collection",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Coin added to somnus collection successfully!",
      coin: data as { id: number; nickname: string; created_at: string },
    })
  } catch (error: unknown) {
    console.error("Error adding coin to somnus collection:", error)

    // Handle validation errors
    if (error instanceof ZodError) {
      console.error("Validation error details:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add coin to somnus collection",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log(
      "🚀 PUT /api/somnus-collection/admin - Updating coin in collection",
    )

    // Use server client for authenticated requests
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    console.log("🔐 Auth check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      authError: authError?.message,
    })

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Parse and validate the request body
    const body: unknown = await request.json()
    console.log(
      "Received request body for somnus collection update:",
      JSON.stringify(body, null, 2),
    )

    // Expect { id: number, updates: Partial<SomnusCollection> }
    const { id, updates } = body as {
      id: number
      updates: Record<string, unknown>
    }

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid coin ID is required" },
        { status: 400 },
      )
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, message: "Updates object is required" },
        { status: 400 },
      )
    }

    // For updates, we allow partial data and don't require full validation
    // Remove system fields that shouldn't be updated
    const systemFields = new Set(['id', 'user_id', 'created_at', 'updated_at'])
    const updateData = Object.fromEntries(
      Object.entries(updates).filter(([key]) => !systemFields.has(key))
    )

    console.log(
      "Update data for somnus collection:",
      JSON.stringify(updateData, null, 2),
    )

    // Update the coin in somnus_collection table
    const tableName = "somnus_collection"
    console.log("Using table:", tableName)

    // Update without changing user_id (preserve ownership)
    const result: PostgrestSingleResponse<Record<string, unknown>> =
      await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", id)
        .eq("user_id", session.user.id) // Ensure user can only update their own coins
        .select()
        .single()

    const { data, error } = result

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update coin in somnus collection",
          error: error.message,
        },
        { status: 500 },
      )
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Coin not found or access denied" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Coin updated successfully!",
      coin: data as { id: number; nickname: string; updated_at: string },
    })
  } catch (error: unknown) {
    console.error("Error updating coin in somnus collection:", error)

    // Handle validation errors
    if (error instanceof ZodError) {
      console.error("Validation error details:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update coin in somnus collection",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
