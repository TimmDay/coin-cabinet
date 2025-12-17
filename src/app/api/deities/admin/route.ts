import type { PostgrestSingleResponse } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import type { Deity } from "~/database/schema-deities"
import { createClient } from "~/database/supabase-server"
import { deityFormSchema } from "~/lib/validations/deity-form"

export async function POST(request: Request) {
  try {
    console.log("🚀 POST /api/deities/admin - Adding deity")

    // Use server client for authenticated requests
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    // Parse and validate the request body
    const body: unknown = await request.json()

    // Validate the request body using Zod schema
    const validationResult = deityFormSchema.safeParse(body)

    if (!validationResult.success) {
      console.error(
        "❌ Validation failed for deity:",
        validationResult.error.errors,
      )
      const fieldErrors = validationResult.error.errors
        .map((err) => {
          const field = err.path.join(".")
          return `${field}: ${err.message}`
        })
        .join("; ")
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${fieldErrors}`,
        },
        { status: 400 },
      )
    }

    const validatedData = validationResult.data

    // Add user_id to the validated data
    const dataWithUserId = {
      ...validatedData,
      user_id: session.user.id,
    }

    const result: PostgrestSingleResponse<Record<string, unknown>> =
      await supabase.from("deities").insert(dataWithUserId).select().single()

    const { data: insertedData, error } = result

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add deity",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Deity added successfully!",
      deity: insertedData as { id: number; name: string; created_at: string },
    })
  } catch (error: unknown) {
    console.error("Error adding deity:", error)

    // Handle validation errors
    if (error instanceof ZodError) {
      console.error("Validation error details:", error)
      const fieldErrors = error.errors
        .map((err) => {
          const field = err.path.join(".")
          return `${field}: ${err.message}`
        })
        .join("; ")
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${fieldErrors}`,
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add deity",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("🚀 PUT /api/deities/admin - Updating deity")

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
    const body = (await request.json()) as {
      id?: number
      updates?: unknown
    }
    const { id, updates } = body

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { success: false, message: "Valid id is required" },
        { status: 400 },
      )
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, message: "Updates data is required" },
        { status: 400 },
      )
    }

    // Validate the updates using the same Zod schema as POST
    const validationResult = deityFormSchema.safeParse(updates)

    if (!validationResult.success) {
      console.error(
        "❌ Validation failed for deity update:",
        validationResult.error.errors,
      )
      const fieldErrors = validationResult.error.errors
        .map((err) => {
          const field = err.path.join(".")
          return `${field}: ${err.message}`
        })
        .join("; ")
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${fieldErrors}`,
        },
        { status: 400 },
      )
    }

    const validatedUpdates = validationResult.data

    // Update deity
    const result = await supabase
      .from("deities")
      .update(validatedUpdates)
      .eq("id", id)
      .select()
      .single()

    if (result.error) {
      console.error("Supabase error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update deity",
          error: result.error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully updated deity with id: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Deity updated successfully",
      deity: result.data as Deity,
    })
  } catch (error: unknown) {
    console.error("Error updating deity:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update deity",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("🚀 DELETE /api/deities/admin - Deleting deity (admin only)")

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

    console.log(`🗑️ Deleting deity with id: ${id}`)

    // Delete deity
    const { error } = await supabase.from("deities").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete deity",
          error: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully deleted deity with id: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Deity deleted successfully!",
    })
  } catch (error: unknown) {
    console.error("Error deleting deity:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete deity",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
