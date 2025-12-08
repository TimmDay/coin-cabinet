import type { PostgrestSingleResponse } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import type { Timeline } from "~/database/schema-timelines"
import { createClient } from "~/database/supabase-server"
import type { TimelineFormData } from "~/database/schema-timelines"

export async function POST(request: Request) {
  try {
    console.log("🚀 POST /api/timelines/admin - Adding timeline")

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
      "Received request body for timeline:",
      JSON.stringify(body, null, 2),
    )

    // Validate that we have the required fields
    const timelineData = body as TimelineFormData
    if (!timelineData.name || typeof timelineData.name !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: Name is required",
        },
        { status: 400 },
      )
    }

    if (
      !timelineData.timeline ||
      !Array.isArray(timelineData.timeline) ||
      timelineData.timeline.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: Timeline events are required",
        },
        { status: 400 },
      )
    }

    console.log(
      "Validated data for timeline:",
      JSON.stringify(timelineData, null, 2),
    )

    // Add user_id to the validated data
    const dataWithUserId = {
      ...timelineData,
      user_id: session.user.id,
    }

    const result: PostgrestSingleResponse<Record<string, unknown>> =
      await supabase.from("timelines").insert(dataWithUserId).select().single()

    const { data: insertedData, error } = result

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add timeline",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Timeline added successfully!",
      timeline: insertedData as {
        id: number
        name: string
        created_at: string
      },
    })
  } catch (error: unknown) {
    console.error("Error adding timeline:", error)

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
        message: "Failed to add timeline",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("🚀 PUT /api/timelines/admin - Updating timeline")

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
      updates?: Partial<TimelineFormData>
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

    console.log(
      `📝 Updating timeline with id: ${id}`,
      JSON.stringify(updates, null, 2),
    )

    // Validate required fields if being updated
    if (
      updates.name !== undefined &&
      (!updates.name || typeof updates.name !== "string")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: Name is required",
        },
        { status: 400 },
      )
    }

    if (
      updates.timeline !== undefined &&
      (!Array.isArray(updates.timeline) || updates.timeline.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: Timeline events are required",
        },
        { status: 400 },
      )
    }

    // Update timeline with explicit updated_at timestamp
    const result = await supabase
      .from("timelines")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (result.error) {
      console.error("Supabase error:", result.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update timeline",
          error: result.error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully updated timeline with id: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Timeline updated successfully",
      timeline: result.data as Timeline,
    })
  } catch (error: unknown) {
    console.error("Error updating timeline:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update timeline",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log(
      "🚀 DELETE /api/timelines/admin - Deleting timeline (admin only)",
    )

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

    console.log(`🗑️ Deleting timeline with id: ${id}`)

    // Delete timeline
    const { error } = await supabase.from("timelines").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete timeline",
          error: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`✅ Successfully deleted timeline with id: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Timeline deleted successfully!",
    })
  } catch (error: unknown) {
    console.error("Error deleting timeline:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete timeline",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
